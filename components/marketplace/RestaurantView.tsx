'use client'
import { useState } from 'react'
import { useMarketplace } from '../../lib/useMarketplace'
import { RequestCard } from './RequestCard'
import { BidCard } from './BidCard'

const CATEGORIES = ['protein', 'produce', 'dairy', 'dry_goods']

type Request = ReturnType<typeof useMarketplace>['requests'][0]

export function RestaurantView() {
  const { requests, addRequest, awardBid, getBidsForRequest } = useMarketplace()
  const [selected, setSelected] = useState<Request | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    restaurant_name: '', category: 'protein', item: '', quantity: '', needed_by: '', notes: '',
  })

  const filtered = filter === 'all' ? requests : requests.filter(r => r.category === filter)
  const selectedBids = selected ? getBidsForRequest(selected.id) : []
  const hasWinner = selectedBids.some(b => b.status === 'winner')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    addRequest(form)
    setForm({ restaurant_name: '', category: 'protein', item: '', quantity: '', needed_by: '', notes: '' })
    setShowForm(false)
    setSubmitting(false)
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Open Requests</h2>
          <p className="text-xs text-muted mt-0.5">
            {requests.filter(r => r.status === 'open').length} active · {requests.filter(r => r.status === 'awarded').length} awarded
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          {showForm ? '✕ Cancel' : '+ New Request'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4">Post Ingredient Request</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Restaurant Name">
                <Input placeholder="Your restaurant" value={form.restaurant_name} onChange={v => setForm(f => ({ ...f, restaurant_name: v }))} required />
              </Field>
              <Field label="Category">
                <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Field label="Item / Ingredient">
                  <Input placeholder="e.g. Wagyu Strip Loin" value={form.item} onChange={v => setForm(f => ({ ...f, item: v }))} required />
                </Field>
              </div>
              <Field label="Quantity">
                <Input placeholder="e.g. 40 lbs" value={form.quantity} onChange={v => setForm(f => ({ ...f, quantity: v }))} required />
              </Field>
              <Field label="Needed By">
                <input type="date" className={inputCls} value={form.needed_by} onChange={e => setForm(f => ({ ...f, needed_by: e.target.value }))} required />
              </Field>
            </div>
            <Field label="Notes / Specs">
              <textarea
                className={`${inputCls} resize-y min-h-[72px]`}
                placeholder="Quality requirements, certifications, preferred brands..."
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              />
            </Field>
            <div className="flex justify-end">
              <button type="submit" disabled={submitting} className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity">
                Post Request
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', ...CATEGORIES].map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize border ${
              filter === c ? 'bg-primary/15 border-primary/40 text-primary-bright' : 'bg-transparent border-white/8 text-muted hover:border-white/16 hover:text-foreground'
            }`}
          >
            {c.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[340px_1fr] gap-5 items-start">
        <div className="flex flex-col gap-2.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <EmptyState icon="📋" title="No requests yet" sub="Post your first ingredient request above." />
          ) : filtered.map(req => (
            <RequestCard key={req.id} request={req} selected={selected?.id === req.id}
              onClick={() => setSelected(req)} bidCount={getBidsForRequest(req.id).length} />
          ))}
        </div>

        <div>
          {selected ? (
            <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Bids for</p>
                  <p className="text-base font-semibold text-foreground mt-0.5">{selected.item}</p>
                </div>
                {hasWinner && <span className="text-[10px] font-bold uppercase tracking-wider bg-success/15 text-success px-2 py-0.5 rounded-full">Awarded</span>}
              </div>
              {selectedBids.length === 0 ? (
                <EmptyState icon="⏳" title="Waiting for bids" sub="Purveyors will submit bids here in real time." />
              ) : (
                <div className="flex flex-col gap-2.5">
                  {selectedBids.map((bid, i) => (
                    <BidCard key={bid.id} bid={bid} rank={i + 1}
                      onAccept={b => awardBid(b.id, selected.id)}
                      canAccept={!hasWinner && selected.status === 'open'} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 min-h-[280px] flex items-center justify-center">
              <EmptyState icon="←" title="Select a request" sub="Click any request to view its bids and award a winner." />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const inputCls = "w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-[rgb(var(--outline))] focus:border-primary/60 focus:outline-none transition-colors"

function Input({ placeholder, value, onChange, required }: { placeholder: string; value: string; onChange: (v: string) => void; required?: boolean }) {
  return <input className={inputCls} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} required={required} />
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function EmptyState({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="text-center py-10">
      <div className="text-3xl mb-3 opacity-40">{icon}</div>
      <p className="font-semibold text-foreground text-sm">{title}</p>
      <p className="text-xs text-muted mt-1.5">{sub}</p>
    </div>
  )
}
