'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { useMarketplace } from '../../lib/useMarketplace'
import { RequestCard } from './RequestCard'

const CATEGORY_ICONS: Record<string, string> = {
  protein: '🥩', produce: '🥬', dairy: '🧀', dry_goods: '🌾',
}

const inputCls = "w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-[rgb(var(--outline))] focus:border-primary/60 focus:outline-none transition-colors"

type Request = ReturnType<typeof useMarketplace>['requests'][0]

export function PurveyorView() {
  const { requests, addBid, getBidsForRequest } = useMarketplace()
  const [selected, setSelected] = useState<Request | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    purveyor_name: '', price_per_unit: '', unit: 'lb', total_price: '', delivery_date: '', notes: '',
  })

  const openRequests = requests.filter(r => r.status === 'open')
  const selectedBids = selected ? getBidsForRequest(selected.id) : []
  const lowestBid = selectedBids.length > 0 ? Math.min(...selectedBids.map(b => b.price_per_unit)) : null

  const handleSelect = (req: Request) => {
    setSelected(req)
    setSubmitted(false)
    setForm(f => ({ ...f, unit: req.category === 'dairy' ? 'unit' : 'lb' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    addBid({
      ...form,
      request_id: selected.id,
      price_per_unit: parseFloat(form.price_per_unit),
      total_price: parseFloat(form.total_price),
    })
    setSubmitting(false)
    setSubmitted(true)
    setForm(f => ({ ...f, price_per_unit: '', total_price: '', notes: '', delivery_date: '' }))
  }

  const priceDiff = lowestBid !== null && form.price_per_unit
    ? parseFloat(form.price_per_unit) - lowestBid
    : null

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Open Requests</h2>
        <p className="text-xs text-muted mt-0.5">{openRequests.length} opportunities available</p>
      </div>

      <div className="grid grid-cols-[340px_1fr] gap-5 items-start">
        <div className="flex flex-col gap-2.5 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
          {openRequests.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-3xl mb-3 opacity-40">🔍</div>
              <p className="font-semibold text-foreground text-sm">No open requests</p>
              <p className="text-xs text-muted mt-1.5">Check back soon — restaurants will post requests here.</p>
            </div>
          ) : openRequests.map(req => (
            <RequestCard key={req.id} request={req} selected={selected?.id === req.id}
              onClick={() => handleSelect(req)} bidCount={getBidsForRequest(req.id).length} />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {selected ? (
            <>
              <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">
                    {CATEGORY_ICONS[selected.category] || '📦'}
                  </div>
                  <div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5 inline-flex ${
                      selected.category === 'protein' ? 'bg-red-500/15 text-red-400' :
                      selected.category === 'produce' ? 'bg-green-500/15 text-green-400' :
                      selected.category === 'dairy' ? 'bg-yellow-500/15 text-yellow-400' :
                      'bg-purple-500/15 text-purple-400'
                    }`}>{selected.category.replace('_', ' ')}</span>
                    <div className="text-[17px] font-bold text-foreground tracking-tight leading-tight">{selected.item}</div>
                    <div className="text-xs text-muted mt-0.5">{selected.restaurant_name}</div>
                  </div>
                </div>

                <div className="h-px bg-white/8 mb-4" />

                <div className="flex flex-wrap gap-5 mb-4">
                  <Spec label="Quantity" value={selected.quantity} />
                  <Spec label="Needed By" value={format(new Date(selected.needed_by), 'MMMM d, yyyy')} />
                  {lowestBid !== null && (
                    <Spec label="Lowest Bid" value={`$${lowestBid.toFixed(2)}/unit`} highlight />
                  )}
                </div>

                {selected.notes && (
                  <div className="bg-white/5 rounded-lg p-3 border-l-3 border-primary/40">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Restaurant Notes</p>
                    <p className="text-xs text-muted leading-relaxed">{selected.notes}</p>
                  </div>
                )}

                {selectedBids.length > 0 && (
                  <>
                    <div className="h-px bg-white/8 my-4" />
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">
                      {selectedBids.length} Current Bid{selectedBids.length !== 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-col divide-y divide-white/8">
                      {selectedBids.map((bid, i) => (
                        <div key={bid.id} className="flex items-center gap-2.5 py-2">
                          <span className="text-[11px] font-bold text-[rgb(var(--outline))] w-6">#{i + 1}</span>
                          <span className="text-sm text-muted flex-1">{bid.purveyor_name}</span>
                          <span className="text-sm font-semibold text-foreground">${bid.price_per_unit.toFixed(2)}/{bid.unit}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4">Submit Your Bid</p>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-success/15 text-success text-xl font-bold flex items-center justify-center mx-auto mb-3">✓</div>
                    <p className="font-semibold text-foreground">Bid submitted!</p>
                    <p className="text-xs text-muted mt-1.5 max-w-[240px] mx-auto">The restaurant will review all bids and award a winner.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-4 px-3 py-1.5 text-xs font-medium border border-white/8 rounded-lg text-muted hover:text-foreground hover:border-white/16 transition-colors">
                      Submit another bid
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Your Company Name</label>
                      <input className={inputCls} placeholder="Purveyor / distributor name" value={form.purveyor_name} onChange={e => setForm(f => ({ ...f, purveyor_name: e.target.value }))} required />
                    </div>
                    <div className="grid grid-cols-[2fr_1fr_2fr] gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Price Per Unit ($)</label>
                        <input type="number" step="0.01" min="0" className={inputCls} placeholder="0.00" value={form.price_per_unit} onChange={e => setForm(f => ({ ...f, price_per_unit: e.target.value }))} required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Unit</label>
                        <select className={inputCls} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                          {['lb','oz','kg','unit','case','flat'].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Total Price ($)</label>
                        <input type="number" step="0.01" min="0" className={inputCls} placeholder="0.00" value={form.total_price} onChange={e => setForm(f => ({ ...f, total_price: e.target.value }))} required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Delivery Date</label>
                      <input type="date" className={inputCls} value={form.delivery_date} onChange={e => setForm(f => ({ ...f, delivery_date: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Notes</label>
                      <textarea className={`${inputCls} resize-y min-h-[64px]`} placeholder="Certifications, sourcing info, special terms..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                    </div>

                    {priceDiff !== null && (
                      <div className={`text-xs font-medium rounded-lg px-3 py-2.5 ${priceDiff < 0 ? 'bg-success/10 text-success border border-success/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                        {priceDiff < 0
                          ? `🏆 Your bid beats the current lowest by $${Math.abs(priceDiff).toFixed(2)}/unit`
                          : `⚠️ Current lowest is $${lowestBid!.toFixed(2)}/unit — you're $${priceDiff.toFixed(2)} above it`}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity">
                        Submit Bid
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 min-h-[280px] flex items-center justify-center">
              <div className="text-center py-10">
                <div className="text-3xl mb-3 opacity-40">←</div>
                <p className="font-semibold text-foreground text-sm">Select a request</p>
                <p className="text-xs text-muted mt-1.5">Choose an open request to submit your bid.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Spec({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--outline))] mb-1">{label}</p>
      <p className={`text-[15px] font-semibold ${highlight ? 'text-success' : 'text-foreground'}`}>{value}</p>
    </div>
  )
}
