'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import { useMarketplace } from '../../lib/useMarketplace'

const inputCls = "w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-[rgb(var(--outline))] focus:border-primary/60 focus:outline-none transition-colors"

export function SpecialsView() {
  const { specials, addSpecial, toggleSpecial, removeSpecial } = useMarketplace()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', start_date: '', end_date: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addSpecial({
      name: form.name,
      description: form.description,
      price: form.price ? parseFloat(form.price) : 0,
      start_date: form.start_date,
      end_date: form.end_date,
    })
    setForm({ name: '', description: '', price: '', start_date: '', end_date: '' })
    setShowForm(false)
  }

  const dateRange = (s: typeof specials[0]) => {
    if (!s.start_date && !s.end_date) return 'Ongoing'
    const start = s.start_date ? format(new Date(s.start_date), 'MMM d') : '—'
    const end = s.end_date ? format(new Date(s.end_date), 'MMM d') : 'ongoing'
    return `${start} → ${end}`
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Specials</h2>
          <p className="text-xs text-muted mt-0.5">
            {specials.filter(s => s.active).length} running · {specials.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          {showForm ? '✕ Cancel' : '+ New Special'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4">New Special</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <Field label="Dish Name">
                <input className={inputCls} placeholder="e.g. Spring Ramp Risotto" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </Field>
              <Field label="Price ($)">
                <input type="number" step="0.01" min="0" className={inputCls} placeholder="0.00" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </Field>
            </div>
            <Field label="Description">
              <textarea className={`${inputCls} resize-y min-h-[64px]`} placeholder="Key ingredients, preparation, what makes it special..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start Date">
                <input type="date" className={inputCls} value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              </Field>
              <Field label="End Date (optional)">
                <input type="date" className={inputCls} value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              </Field>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity">
                Add Special
              </button>
            </div>
          </form>
        </div>
      )}

      {specials.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))]">
          <div className="text-3xl mb-3 opacity-40">✨</div>
          <p className="font-semibold text-foreground text-sm">No specials yet</p>
          <p className="text-xs text-muted mt-1.5">Add a special to feature what you&apos;re running this season.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {specials.map(s => (
            <div key={s.id} className={`rounded-xl border p-5 transition-all group ${s.active ? 'border-white/8 bg-[rgb(var(--surface-container-low))]' : 'border-white/8 bg-white/3 opacity-60'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-success' : 'bg-[rgb(var(--outline))]'}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">{s.active ? 'Running' : 'Paused'}</span>
                </div>
                {s.price > 0 && <span className="text-lg font-bold text-foreground tracking-tight">${s.price}</span>}
              </div>
              <div className="text-[16px] font-semibold text-foreground mb-1">{s.name}</div>
              {s.description && <p className="text-xs text-muted leading-relaxed mb-3">{s.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[rgb(var(--outline))]">{dateRange(s)}</span>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => toggleSpecial(s.id)} className="text-xs font-medium text-muted hover:text-foreground">
                    {s.active ? 'Pause' : 'Resume'}
                  </button>
                  <button onClick={() => removeSpecial(s.id)} className="text-xs text-[rgb(var(--outline))] hover:text-failure">Remove</button>
                </div>
              </div>
            </div>
          ))}
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
