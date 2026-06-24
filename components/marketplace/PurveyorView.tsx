'use client'
import { useState } from 'react'
import { useMarketplace } from '../../lib/useMarketplace'
import { OfferingCard } from './OfferingCard'
import {
  type Grade,
  type Availability,
  type DeliveryOption,
  GRADE_LABELS,
  AVAILABILITY_LABELS,
  DELIVERY_LABELS,
} from '../../lib/mockData'

const inputCls = "w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-[rgb(var(--outline))] focus:border-primary/60 focus:outline-none transition-colors"

const CATEGORIES: { value: 'protein' | 'produce' | 'dairy' | 'dry_goods'; label: string }[] = [
  { value: 'protein', label: '🥩 Protein' },
  { value: 'produce', label: '🥬 Produce' },
  { value: 'dairy', label: '🧀 Dairy' },
  { value: 'dry_goods', label: '🌾 Dry goods' },
]

const GRADES = Object.keys(GRADE_LABELS) as Grade[]
const AVAILABILITIES = Object.keys(AVAILABILITY_LABELS) as Availability[]
const DELIVERY_OPTS = Object.keys(DELIVERY_LABELS) as DeliveryOption[]

const blankForm = {
  item: '',
  category: 'produce' as 'protein' | 'produce' | 'dairy' | 'dry_goods',
  grade: 'standard' as Grade,
  availability: 'on_hand' as Availability,
  delivery_options: ['pickup'] as DeliveryOption[],
  quantity: '',
  unit: 'lb',
  price_per_unit: '',
  notes: '',
}

export function PurveyorView() {
  const { purveyors, getOfferingsForPurveyor, addOffering } = useMarketplace()
  const [activeId, setActiveId] = useState(purveyors[0]?.id ?? '')
  const [showForm, setShowForm] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const [form, setForm] = useState(blankForm)

  const active = purveyors.find(p => p.id === activeId)
  const offerings = active ? getOfferingsForPurveyor(active.id) : []

  const toggleDelivery = (opt: DeliveryOption) => {
    setForm(f => ({
      ...f,
      delivery_options: f.delivery_options.includes(opt)
        ? f.delivery_options.filter(o => o !== opt)
        : [...f.delivery_options, opt],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!active || form.delivery_options.length === 0) return
    addOffering({
      purveyor_id: active.id,
      item: form.item,
      category: form.category,
      grade: form.grade,
      availability: form.availability,
      delivery_options: form.delivery_options,
      quantity: form.quantity,
      unit: form.unit,
      price_per_unit: parseFloat(form.price_per_unit),
      notes: form.notes || undefined,
    })
    setForm(blankForm)
    setShowForm(false)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2500)
  }

  return (
    <div>
      {/* Purveyor selector */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Purveyor Storefront</h2>
        <p className="text-xs text-muted mt-0.5">Offer what you have on hand or coming soon — restaurants browse it here.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {purveyors.map(p => (
            <button
              key={p.id}
              onClick={() => { setActiveId(p.id); setShowForm(false) }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
                p.id === activeId
                  ? 'bg-[rgb(var(--surface-container-high))] border-primary/40 text-foreground'
                  : 'bg-white/5 border-white/8 text-muted hover:text-foreground'
              }`}
            >
              <span className="text-lg">{p.emoji}</span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {active && (
        <>
          {/* Storefront header */}
          <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 mb-5 flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-3xl flex-shrink-0">
              {active.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-foreground tracking-tight">{active.name}</div>
              <p className="text-sm text-muted mt-0.5">{active.tagline}</p>
              <div className="flex gap-1.5 mt-2">
                {active.focus.map(f => (
                  <span key={f} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-muted">
                    {f.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowForm(s => !s)}
              className="px-3.5 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity flex-shrink-0"
            >
              {showForm ? 'Cancel' : '+ New offering'}
            </button>
          </div>

          {justAdded && (
            <div className="mb-5 text-sm font-medium rounded-lg px-4 py-3 bg-success/10 text-success border border-success/20">
              ✓ Offering posted to {active.name}'s storefront.
            </div>
          )}

          {/* Add-offering form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 mb-6 space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">New Offering</p>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Ingredient</label>
                <input className={inputCls} placeholder="e.g. Heirloom Tomatoes" value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Category</label>
                  <select className={inputCls} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as typeof f.category }))}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Grade</label>
                  <select className={inputCls} value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value as Grade }))}>
                    {GRADES.map(g => <option key={g} value={g}>{GRADE_LABELS[g]}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Availability</label>
                <select className={inputCls} value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value as Availability }))}>
                  {AVAILABILITIES.map(a => <option key={a} value={a}>{AVAILABILITY_LABELS[a]}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Delivery options</label>
                <div className="flex flex-wrap gap-2">
                  {DELIVERY_OPTS.map(opt => {
                    const on = form.delivery_options.includes(opt)
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleDelivery(opt)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                          on ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/8 text-muted hover:text-foreground'
                        }`}
                      >
                        {on ? '✓ ' : ''}🚚 {DELIVERY_LABELS[opt]}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-[2fr_1fr_2fr] gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Quantity</label>
                  <input className={inputCls} placeholder="e.g. 30 lbs" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Unit</label>
                  <select className={inputCls} value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                    {['lb', 'oz', 'kg', 'unit', 'case', 'flat'].map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Price / unit ($)</label>
                  <input type="number" step="0.01" min="0" className={inputCls} placeholder="0.00" value={form.price_per_unit} onChange={e => setForm(f => ({ ...f, price_per_unit: e.target.value }))} required />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Notes (optional)</label>
                <textarea className={`${inputCls} resize-y min-h-[56px]`} placeholder="Sourcing, certifications, aging, varieties..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity">
                  Post offering
                </button>
              </div>
            </form>
          )}

          {/* Offerings grid */}
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-3">
            {offerings.length} {offerings.length === 1 ? 'offering' : 'offerings'}
          </p>
          {offerings.length === 0 ? (
            <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-10 text-center">
              <div className="text-3xl mb-3 opacity-40">🧺</div>
              <p className="font-semibold text-foreground text-sm">No offerings yet</p>
              <p className="text-xs text-muted mt-1.5">Click "+ New offering" to list something this purveyor has available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {offerings.map(o => <OfferingCard key={o.id} offering={o} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
