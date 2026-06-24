'use client'
import { useState } from 'react'
import { useMarketplace } from '../../lib/useMarketplace'
import type { RecipeIngredient } from '../../lib/mockData'

const CATEGORIES = ['protein', 'produce', 'dairy', 'dry_goods']
const CATEGORY_ICONS: Record<string, string> = { protein: '🥩', produce: '🥬', dairy: '🧀', dry_goods: '🌾' }

const inputCls = "w-full bg-white/5 border border-white/8 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-[rgb(var(--outline))] focus:border-primary/60 focus:outline-none transition-colors"

const blankIngredient = (): RecipeIngredient => ({ name: '', category: 'produce', quantity: '' })

export function RecipesView() {
  const { recipes, addRecipe, removeRecipe } = useMarketplace()
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [yieldText, setYieldText] = useState('')
  const [notes, setNotes] = useState('')
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([blankIngredient()])

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200) }

  const reset = () => {
    setName(''); setYieldText(''); setNotes(''); setIngredients([blankIngredient()]); setShowForm(false)
  }

  const updateIngredient = (i: number, patch: Partial<RecipeIngredient>) => {
    setIngredients(list => list.map((ing, idx) => idx === i ? { ...ing, ...patch } : ing))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = ingredients.filter(ing => ing.name.trim())
    if (!name.trim() || cleaned.length === 0) return
    addRecipe({ name: name.trim(), yield_text: yieldText.trim() || undefined, ingredients: cleaned, notes: notes.trim() || undefined })
    reset()
    flash('Recipe saved')
  }

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">Recipes</h2>
          <p className="text-xs text-muted mt-0.5">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} · track the ingredients each dish needs</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity"
        >
          {showForm ? '✕ Cancel' : '+ New Recipe'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 mb-6 space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">New Recipe</p>
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <Field label="Recipe name">
              <input className={inputCls} placeholder="e.g. Brown Butter Gnocchi" value={name} onChange={e => setName(e.target.value)} required />
            </Field>
            <Field label="Yield (optional)">
              <input className={inputCls} placeholder="e.g. 40 portions" value={yieldText} onChange={e => setYieldText(e.target.value)} />
            </Field>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Ingredients</label>
            <div className="flex flex-col gap-2">
              {ingredients.map((ing, i) => (
                <div key={i} className="grid grid-cols-[2fr_1.2fr_1fr_auto] gap-2 items-center">
                  <input className={inputCls} placeholder="Ingredient" value={ing.name} onChange={e => updateIngredient(i, { name: e.target.value })} />
                  <select className={inputCls} value={ing.category} onChange={e => updateIngredient(i, { category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                  </select>
                  <input className={inputCls} placeholder="Qty (e.g. 6 lb)" value={ing.quantity} onChange={e => updateIngredient(i, { quantity: e.target.value })} />
                  <button
                    type="button"
                    onClick={() => setIngredients(list => list.length > 1 ? list.filter((_, idx) => idx !== i) : list)}
                    className="px-2 py-2 text-[rgb(var(--outline))] hover:text-failure text-sm"
                    title="Remove ingredient"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIngredients(list => [...list, blankIngredient()])}
              className="mt-2 text-xs font-medium text-primary-bright hover:underline"
            >
              + Add ingredient
            </button>
          </div>

          <Field label="Notes (optional)">
            <input className={inputCls} placeholder="Prep notes, when it's served..." value={notes} onChange={e => setNotes(e.target.value)} />
          </Field>

          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 text-sm font-semibold bg-primary text-black rounded-lg hover:opacity-90 transition-opacity">
              Save Recipe
            </button>
          </div>
        </form>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))]">
          <div className="text-3xl mb-3 opacity-40">📖</div>
          <p className="font-semibold text-foreground text-sm">No recipes yet</p>
          <p className="text-xs text-muted mt-1.5">Add a recipe to track the ingredients each dish uses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map(r => (
            <div key={r.id} className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-base font-bold text-foreground tracking-tight">{r.name}</div>
                  {r.yield_text && <div className="text-xs text-muted mt-0.5">{r.yield_text}</div>}
                </div>
                <button
                  onClick={() => removeRecipe(r.id)}
                  className="text-[rgb(var(--outline))] hover:text-failure text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete recipe"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col divide-y divide-white/8">
                {r.ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    <span className="text-sm w-5 text-center">{CATEGORY_ICONS[ing.category] || '📦'}</span>
                    <span className="text-sm text-foreground flex-1">{ing.name}</span>
                    <span className="text-xs text-muted">{ing.quantity}</span>
                  </div>
                ))}
              </div>
              {r.notes && <p className="text-xs text-muted mt-3 border-l-2 border-primary/40 pl-2.5">{r.notes}</p>}
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
