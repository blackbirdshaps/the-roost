'use client'
import { useState } from 'react'
import { useMarketplace } from '../../lib/useMarketplace'

const CATEGORIES = ['protein', 'produce', 'dairy', 'dry_goods']
const CATEGORY_ICONS: Record<string, string> = { protein: '🥩', produce: '🥬', dairy: '🧀', dry_goods: '🌾' }

const inputCls = "w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-[rgb(var(--outline))] focus:border-primary/60 focus:outline-none transition-colors"

export function SubscriptionsView() {
  const { subscriptions, addSubscription, getSubBidsForSubscription, awardSubBid } = useMarketplace()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ restaurant_name: '', item: '', category: 'dairy', qty_per_week: '', unit: 'lb', weeks: '', notes: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addSubscription({
      restaurant_name: form.restaurant_name || 'My Restaurant',
      item: form.item,
      category: form.category,
      qty_per_week: parseFloat(form.qty_per_week),
      unit: form.unit,
      weeks: parseInt(form.weeks, 10),
      notes: form.notes || undefined,
    })
    setForm({ restaurant_name: '', item: '', category: 'dairy', qty_per_week: '', unit: 'lb', weeks: '', notes: '' })
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Subscriptions</h2>
          <p className="text-xs text-muted mt-0.5">Commit to a recurring volume — purveyors pitch a discounted price and you pick the best deal.</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          {showForm ? '✕ Cancel' : '+ New Subscription'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 mb-6 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Offer a Subscription</p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Restaurant name">
              <input className={inputCls} placeholder="Your restaurant" value={form.restaurant_name} onChange={e => setForm(f => ({ ...f, restaurant_name: e.target.value }))} />
            </Field>
            <Field label="Ingredient">
              <input className={inputCls} placeholder="e.g. Cultured Butter" value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} required />
            </Field>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Field label="Category">
              <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </Field>
            <Field label="Qty / week">
              <input type="number" step="0.1" min="0" className={inputCls} placeholder="100" value={form.qty_per_week} onChange={e => setForm(f => ({ ...f, qty_per_week: e.target.value }))} required />
            </Field>
            <Field label="Unit">
              <select className={inputCls} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                {['lb', 'oz', 'kg', 'gal', 'unit', 'case', 'flat'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="# Weeks">
              <input type="number" step="1" min="1" className={inputCls} placeholder="12" value={form.weeks} onChange={e => setForm(f => ({ ...f, weeks: e.target.value }))} required />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <input className={inputCls} placeholder="Quality specs, delivery cadence..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </Field>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity">
              Post Subscription
            </button>
          </div>
        </form>
      )}

      {subscriptions.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))]">
          <div className="text-3xl mb-3 opacity-40">🔁</div>
          <p className="font-semibold text-foreground text-sm">No subscriptions yet</p>
          <p className="text-xs text-muted mt-1.5">Post a recurring commitment and let purveyors compete on price.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {subscriptions.map(sub => {
            const pitches = getSubBidsForSubscription(sub.id)
            const totalQty = sub.qty_per_week * sub.weeks
            const best = pitches[0]
            const awarded = sub.status === 'awarded'
            return (
              <div key={sub.id} className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl flex-shrink-0">{CATEGORY_ICONS[sub.category] || '📦'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] font-bold text-foreground tracking-tight">{sub.item}</span>
                      {awarded && <span className="text-[10px] font-bold uppercase tracking-wider bg-success/15 text-success px-2 py-0.5 rounded-full">Awarded</span>}
                    </div>
                    <div className="text-xs text-muted mt-0.5">
                      {sub.restaurant_name} · {sub.qty_per_week} {sub.unit}/week for {sub.weeks} weeks
                      <span className="text-[rgb(var(--outline))]"> · {totalQty.toLocaleString()} {sub.unit} total</span>
                    </div>
                    {sub.notes && <div className="text-xs text-muted mt-1">{sub.notes}</div>}
                  </div>
                </div>

                <div className="h-px bg-white/8 mb-3" />

                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
                  {pitches.length} purveyor pitch{pitches.length !== 1 ? 'es' : ''}
                </p>

                {pitches.length === 0 ? (
                  <p className="text-xs text-muted py-2">No pitches yet — purveyors will respond from their Subscriptions tab.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {pitches.map((p, i) => {
                      const weeklyCost = p.price_per_unit * sub.qty_per_week
                      const totalCost = weeklyCost * sub.weeks
                      const isBest = best && p.id === best.id
                      const isWinner = p.status === 'winner'
                      return (
                        <div key={p.id} className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
                          isWinner ? 'border-success/40 bg-success/5' : isBest && !awarded ? 'border-primary/40 bg-primary/5' : 'border-white/8'
                        }`}>
                          <span className="text-[11px] font-bold text-[rgb(var(--outline))] w-5">#{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">{p.purveyor_name}</span>
                              {isBest && !awarded && <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">Best price</span>}
                              {isWinner && <span className="text-[9px] font-bold uppercase tracking-wider bg-success/15 text-success px-1.5 py-0.5 rounded-full">Winner</span>}
                            </div>
                            {p.notes && <div className="text-xs text-muted mt-0.5">{p.notes}</div>}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-foreground">${p.price_per_unit.toFixed(2)}/{p.unit}</div>
                            <div className="text-[11px] text-muted">${weeklyCost.toFixed(0)}/wk · ${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })} total</div>
                          </div>
                          {!awarded && (
                            <button
                              onClick={() => awardSubBid(p.id, sub.id)}
                              className="px-3 py-1.5 text-xs font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
                            >
                              Award
                            </button>
                          )}
                        </div>
                      )
                    })}
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">{label}</label>
      {children}
    </div>
  )
}
