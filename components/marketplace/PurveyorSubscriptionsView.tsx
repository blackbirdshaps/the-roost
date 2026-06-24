'use client'
import { useState } from 'react'
import { useMarketplace } from '../../lib/useMarketplace'

const CATEGORY_ICONS: Record<string, string> = { protein: '🥩', produce: '🥬', dairy: '🧀', dry_goods: '🌾' }
const inputCls = "w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-[rgb(var(--outline))] focus:border-primary/60 focus:outline-none transition-colors"

export function PurveyorSubscriptionsView({ purveyorName }: { purveyorName: string }) {
  const { subscriptions, getSubBidsForSubscription, addSubBid } = useMarketplace()
  const [drafts, setDrafts] = useState<Record<string, { price: string; notes: string }>>({})

  const open = subscriptions.filter(s => s.status === 'open')

  const setDraft = (id: string, patch: Partial<{ price: string; notes: string }>) =>
    setDrafts(d => ({ ...d, [id]: { ...(d[id] ?? { price: '', notes: '' }), ...patch } }))

  const submitPitch = (subscriptionId: string, unit: string) => {
    const draft = drafts[subscriptionId]
    if (!draft?.price) return
    addSubBid({
      subscription_id: subscriptionId,
      purveyor_name: purveyorName,
      price_per_unit: parseFloat(draft.price),
      unit,
      notes: draft.notes || undefined,
    })
    setDrafts(d => ({ ...d, [subscriptionId]: { price: '', notes: '' } }))
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">Open Subscription Offers</h3>
        <p className="text-xs text-muted mt-0.5">Pitch a discounted recurring price as <span className="text-foreground font-medium">{purveyorName}</span>.</p>
      </div>

      {open.length === 0 ? (
        <div className="text-center py-14 rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))]">
          <div className="text-3xl mb-3 opacity-40">🔁</div>
          <p className="font-semibold text-foreground text-sm">No open subscriptions</p>
          <p className="text-xs text-muted mt-1.5">When restaurants post recurring commitments, they show up here to pitch on.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {open.map(sub => {
            const pitches = getSubBidsForSubscription(sub.id)
            const mine = pitches.find(p => p.purveyor_name === purveyorName)
            const totalQty = sub.qty_per_week * sub.weeks
            const draft = drafts[sub.id] ?? { price: '', notes: '' }
            const weeklyCost = draft.price ? parseFloat(draft.price) * sub.qty_per_week : null
            return (
              <div key={sub.id} className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl flex-shrink-0">{CATEGORY_ICONS[sub.category] || '📦'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-bold text-foreground tracking-tight">{sub.item}</div>
                    <div className="text-xs text-muted mt-0.5">
                      {sub.restaurant_name} · {sub.qty_per_week} {sub.unit}/week for {sub.weeks} weeks
                      <span className="text-[rgb(var(--outline))]"> · {totalQty.toLocaleString()} {sub.unit} total commitment</span>
                    </div>
                    {sub.notes && <div className="text-xs text-muted mt-1">{sub.notes}</div>}
                  </div>
                  <span className="text-[11px] font-medium text-muted bg-white/5 px-2.5 py-1 rounded-full flex-shrink-0">
                    {pitches.length} pitch{pitches.length !== 1 ? 'es' : ''}
                  </span>
                </div>

                {mine ? (
                  <div className="rounded-lg border border-success/30 bg-success/5 px-4 py-3 text-sm">
                    <span className="text-success font-semibold">✓ Pitch submitted</span>
                    <span className="text-muted"> — ${mine.price_per_unit.toFixed(2)}/{mine.unit} (${(mine.price_per_unit * sub.qty_per_week).toFixed(0)}/wk)</span>
                    {mine.status === 'winner' && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-success/15 text-success px-1.5 py-0.5 rounded-full">You won this</span>}
                    {mine.status === 'loser' && <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-muted px-1.5 py-0.5 rounded-full">Not selected</span>}
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/8 bg-black/15 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-3">Your pitch</p>
                    <div className="flex items-end gap-3 flex-wrap">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--outline))] mb-1">Price / {sub.unit}</label>
                        <input type="number" step="0.01" min="0" className={`${inputCls} w-28`} placeholder="0.00" value={draft.price} onChange={e => setDraft(sub.id, { price: e.target.value })} />
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--outline))] mb-1">Notes (optional)</label>
                        <input className={inputCls} placeholder="Lock terms, delivery cadence, perks..." value={draft.notes} onChange={e => setDraft(sub.id, { notes: e.target.value })} />
                      </div>
                      <button
                        onClick={() => submitPitch(sub.id, sub.unit)}
                        disabled={!draft.price}
                        className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity"
                      >
                        Submit pitch
                      </button>
                    </div>
                    {weeklyCost !== null && (
                      <p className="text-xs text-muted mt-2">
                        That&apos;s <span className="text-foreground font-medium">${weeklyCost.toFixed(0)}/week</span> · ${(weeklyCost * sub.weeks).toLocaleString(undefined, { maximumFractionDigits: 0 })} over {sub.weeks} weeks.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
