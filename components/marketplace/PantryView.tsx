'use client'
import { useState } from 'react'
import { useMarketplace, parseBulkPantry } from '../../lib/useMarketplace'

const CATEGORIES = ['protein', 'produce', 'dairy', 'dry_goods']
const CATEGORY_ICONS: Record<string, string> = { protein: '🥩', produce: '🥬', dairy: '🧀', dry_goods: '🌾' }
const CATEGORY_COLORS: Record<string, string> = {
  protein: 'bg-red-500/15 text-red-400',
  produce: 'bg-green-500/15 text-green-400',
  dairy: 'bg-yellow-500/15 text-yellow-400',
  dry_goods: 'bg-purple-500/15 text-purple-400',
}

const inputCls = "w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-[rgb(var(--outline))] focus:border-primary/60 focus:outline-none transition-colors"

export function PantryView() {
  const { pantry, addPantryItem, addPantryBulk, removePantryItem, addRequest } = useMarketplace()
  const [mode, setMode] = useState<'none' | 'single' | 'bulk'>('none')
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState<string | null>(null)

  // single add
  const [single, setSingle] = useState({ name: '', category: 'produce', default_quantity: '', seasonal: false, notes: '' })
  // bulk add
  const [bulkText, setBulkText] = useState('')
  const bulkPreview = parseBulkPantry(bulkText)

  const filtered = filter === 'all' ? pantry : pantry.filter(p => p.category === filter)

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  const handleAddSingle = (e: React.FormEvent) => {
    e.preventDefault()
    addPantryItem(single)
    setSingle({ name: '', category: 'produce', default_quantity: '', seasonal: false, notes: '' })
    setMode('none')
    flash('Added to pantry')
  }

  const handleAddBulk = () => {
    const count = addPantryBulk(bulkPreview)
    setBulkText('')
    setMode('none')
    flash(`Imported ${count} ingredient${count !== 1 ? 's' : ''}`)
  }

  const handleRequest = (item: typeof pantry[0]) => {
    const neededBy = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
    addRequest({
      restaurant_name: '',
      category: item.category,
      item: item.name,
      quantity: item.default_quantity || '1',
      needed_by: neededBy,
      notes: item.notes || '',
    })
    flash(`Request created for ${item.name} — see the Requests tab`)
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Pantry</h2>
          <p className="text-xs text-muted mt-0.5">
            {pantry.length} staple ingredient{pantry.length !== 1 ? 's' : ''}
            {pantry.some(p => p.seasonal) && ` · ${pantry.filter(p => p.seasonal).length} seasonal`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setMode(m => m === 'bulk' ? 'none' : 'bulk')}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${mode === 'bulk' ? 'bg-primary/15 border-primary/40 text-primary-bright' : 'border-white/8 text-muted hover:text-foreground hover:border-white/16'}`}
          >
            ⬆ Mass Upload
          </button>
          <button
            onClick={() => setMode(m => m === 'single' ? 'none' : 'single')}
            className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            {mode === 'single' ? '✕ Cancel' : '+ Add Ingredient'}
          </button>
        </div>
      </div>

      {/* Mass upload */}
      {mode === 'bulk' && (
        <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-1">Mass Upload</p>
          <p className="text-xs text-muted mb-3 leading-relaxed">
            Paste one ingredient per line as <code className="bg-white/10 px-1 rounded text-foreground">name, category, quantity</code>.
            Category and quantity are optional — we&apos;ll guess the category if you leave it out.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <textarea
              className={`${inputCls} font-mono text-xs min-h-[180px] resize-y`}
              placeholder={"Wagyu Strip Loin, protein, 40 lbs\nHeirloom Tomatoes, produce, 25 lbs\nArborio Rice, dry goods, 50 lbs\nButtermilk, dairy, 4 gal"}
              value={bulkText}
              onChange={e => setBulkText(e.target.value)}
            />
            <div className="rounded-lg border border-white/8 bg-black/20 p-3 overflow-y-auto max-h-[180px]">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--outline))] mb-2">
                Preview · {bulkPreview.length} item{bulkPreview.length !== 1 ? 's' : ''}
              </p>
              {bulkPreview.length === 0 ? (
                <p className="text-xs text-muted">Parsed ingredients show up here as you type.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {bulkPreview.map((it, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span>{CATEGORY_ICONS[it.category]}</span>
                      <span className="text-foreground font-medium flex-1 truncate">{it.name}</span>
                      <span className="text-[rgb(var(--outline))]">{it.default_quantity || '—'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleAddBulk}
              disabled={bulkPreview.length === 0}
              className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              Import {bulkPreview.length || ''} {bulkPreview.length === 1 ? 'Ingredient' : 'Ingredients'}
            </button>
          </div>
        </div>
      )}

      {/* Single add */}
      {mode === 'single' && (
        <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted mb-4">Add Ingredient</p>
          <form onSubmit={handleAddSingle} className="space-y-4">
            <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
              <Field label="Ingredient">
                <input className={inputCls} placeholder="e.g. Meyer Lemons" value={single.name} onChange={e => setSingle(s => ({ ...s, name: e.target.value }))} required />
              </Field>
              <Field label="Category">
                <select className={inputCls} value={single.category} onChange={e => setSingle(s => ({ ...s, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                </select>
              </Field>
              <Field label="Typical Quantity">
                <input className={inputCls} placeholder="e.g. 20 lbs" value={single.default_quantity} onChange={e => setSingle(s => ({ ...s, default_quantity: e.target.value }))} />
              </Field>
            </div>
            <Field label="Notes">
              <input className={inputCls} placeholder="Sourcing preferences, specs..." value={single.notes} onChange={e => setSingle(s => ({ ...s, notes: e.target.value }))} />
            </Field>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
                <input type="checkbox" className="accent-[rgb(var(--core-primary))] w-4 h-4" checked={single.seasonal} onChange={e => setSingle(s => ({ ...s, seasonal: e.target.checked }))} />
                Seasonal item
              </label>
              <button type="submit" className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity">
                Add to Pantry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {['all', ...CATEGORIES].map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize border ${filter === c ? 'bg-primary/15 border-primary/40 text-primary-bright' : 'bg-transparent border-white/8 text-muted hover:border-white/16 hover:text-foreground'}`}
          >
            {c.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Pantry table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))]">
          <div className="text-3xl mb-3 opacity-40">🧺</div>
          <p className="font-semibold text-foreground text-sm">Your pantry is empty</p>
          <p className="text-xs text-muted mt-1.5">Add ingredients or mass-upload your regular order list above.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] overflow-hidden">
          {filtered.map((item, i) => (
            <div key={item.id} className={`flex items-center gap-4 px-4 py-3 ${i !== filtered.length - 1 ? 'border-b border-white/8' : ''} hover:bg-white/3 transition-colors group`}>
              <span className="text-lg w-6 text-center">{CATEGORY_ICONS[item.category]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">{item.name}</span>
                  {item.seasonal && <span className="text-[9px] font-bold uppercase tracking-wider bg-yellow-500/15 text-yellow-400 px-1.5 py-0.5 rounded-full">Seasonal</span>}
                </div>
                {item.notes && <span className="text-xs text-muted">{item.notes}</span>}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_COLORS[item.category]}`}>
                {item.category.replace('_', ' ')}
              </span>
              <span className="text-sm text-muted w-20 text-right">{item.default_quantity || '—'}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleRequest(item)}
                  className="px-3 py-1.5 text-xs font-semibold bg-primary/15 text-primary-bright rounded-lg hover:bg-primary/25 transition-colors"
                >
                  Request
                </button>
                <button
                  onClick={() => removePantryItem(item.id)}
                  className="px-2 py-1.5 text-xs text-[rgb(var(--outline))] hover:text-failure opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[rgb(var(--surface-container-highest))] border border-white/16 text-foreground text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg">
          {toast}
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
