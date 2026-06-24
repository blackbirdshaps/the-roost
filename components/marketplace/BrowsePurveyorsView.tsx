'use client'
import { useState } from 'react'
import { useMarketplace } from '../../lib/useMarketplace'
import { OfferingCard } from './OfferingCard'

const CATEGORIES = ['protein', 'produce', 'dairy', 'dry_goods']

export function BrowsePurveyorsView() {
  const { purveyors, getOfferingsForPurveyor } = useMarketplace()
  const [browseCat, setBrowseCat] = useState('all')
  const [onHandOnly, setOnHandOnly] = useState(false)
  const [highGradeOnly, setHighGradeOnly] = useState(false)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Browse Purveyors</h2>
        <p className="text-xs text-muted mt-0.5">See what each purveyor has on hand or coming soon.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {['all', ...CATEGORIES].map(c => (
          <button
            key={c}
            onClick={() => setBrowseCat(c)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all capitalize border ${
              browseCat === c ? 'bg-primary/15 border-primary/40 text-primary-bright' : 'bg-transparent border-white/8 text-muted hover:border-white/16 hover:text-foreground'
            }`}
          >
            {c.replace('_', ' ')}
          </button>
        ))}
        <span className="w-px h-5 bg-white/8 mx-1" />
        <button
          onClick={() => setOnHandOnly(v => !v)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
            onHandOnly ? 'bg-success/15 border-success/40 text-success' : 'bg-transparent border-white/8 text-muted hover:border-white/16 hover:text-foreground'
          }`}
        >
          ● On hand now
        </button>
        <button
          onClick={() => setHighGradeOnly(v => !v)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
            highGradeOnly ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-transparent border-white/8 text-muted hover:border-white/16 hover:text-foreground'
          }`}
        >
          ★ High-grade only
        </button>
      </div>

      {/* Storefronts */}
      <div className="flex flex-col gap-8">
        {purveyors.map(p => {
          const items = getOfferingsForPurveyor(p.id).filter(o =>
            (browseCat === 'all' || o.category === browseCat) &&
            (!onHandOnly || o.availability === 'on_hand') &&
            (!highGradeOnly || o.grade === 'high_grade')
          )
          return (
            <div key={p.id}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-2xl flex-shrink-0">{p.emoji}</div>
                <div>
                  <div className="text-base font-bold text-foreground tracking-tight">{p.name}</div>
                  <p className="text-xs text-muted">{p.tagline}</p>
                </div>
                <span className="ml-auto text-[11px] font-medium text-muted bg-white/5 px-2.5 py-1 rounded-full">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/8 p-6 text-center text-xs text-muted">
                  Nothing matches your filters from this purveyor.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(o => <OfferingCard key={o.id} offering={o} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
