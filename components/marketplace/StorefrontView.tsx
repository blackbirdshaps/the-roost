'use client'
import { useState, useMemo } from 'react'
import { useMarketplace } from '../../lib/useMarketplace'
import { DISTRIBUTORS } from '../../lib/mockData'

const CATEGORIES = ['protein', 'produce', 'dairy', 'dry_goods']
const CATEGORY_ICONS: Record<string, string> = { protein: '🥩', produce: '🥬', dairy: '🧀', dry_goods: '🌾' }
const CATEGORY_COLORS: Record<string, string> = {
  protein: 'bg-red-500/15 text-red-400',
  produce: 'bg-green-500/15 text-green-400',
  dairy: 'bg-yellow-500/15 text-yellow-400',
  dry_goods: 'bg-purple-500/15 text-purple-400',
}

type Listing = ReturnType<typeof useMarketplace>['storefront'][0]

export function StorefrontView() {
  const { storefront, addRequest } = useMarketplace()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [toast, setToast] = useState<string | null>(null)

  const q = query.trim().toLowerCase()

  // Group listings by product, sort each product's offers by price (cheapest first).
  const products = useMemo(() => {
    const groups = new Map<string, { name: string; category: string; offers: Listing[] }>()
    for (const l of storefront) {
      const key = l.product_name.toLowerCase()
      if (!groups.has(key)) groups.set(key, { name: l.product_name, category: l.category, offers: [] })
      groups.get(key)!.offers.push(l)
    }
    return [...groups.values()]
      .map(g => ({ ...g, offers: [...g.offers].sort((a, b) => a.price_per_unit - b.price_per_unit) }))
      .filter(g => filter === 'all' || g.category === filter)
      .filter(g =>
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.offers.some(o => o.distributor.toLowerCase().includes(q)),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [storefront, q, filter])

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2400)
  }

  const handleRequest = (offer: Listing) => {
    const neededBy = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
    addRequest({
      restaurant_name: '',
      category: offer.category,
      item: offer.product_name,
      quantity: offer.min_order || '1',
      needed_by: neededBy,
      notes: `Storefront request — ${offer.distributor} listed at $${offer.price_per_unit.toFixed(2)}/${offer.unit}`,
    })
    flash(`Request created for ${offer.product_name} — see the Requests tab`)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Purveyor Storefront</h2>
        <p className="text-xs text-muted mt-0.5">
          Search a product to see which distributors carry it in-house — and at what price
        </p>
      </div>

      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products or distributors — e.g. Farm Stand Cultured Butter, Baldor"
          className="w-full bg-white/5 border border-white/8 rounded-lg pl-9 pr-9 py-2.5 text-sm text-foreground placeholder:text-[rgb(var(--outline))] focus:border-primary/60 focus:outline-none transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--outline))] hover:text-foreground text-sm"
            title="Clear"
          >
            ✕
          </button>
        )}
      </div>

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

      {products.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))]">
          <div className="text-3xl mb-3 opacity-40">🔍</div>
          <p className="font-semibold text-foreground text-sm">No products found</p>
          <p className="text-xs text-muted mt-1.5">
            {q ? `Nothing matches “${query.trim()}”. Try a different term.` : 'No products in this category.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map(product => {
            const lowest = product.offers[0]?.price_per_unit
            const highest = product.offers[product.offers.length - 1]?.price_per_unit
            const carriedCount = DISTRIBUTORS.filter(d =>
              product.offers.some(o => o.distributor === d.name && o.in_stock),
            ).length
            return (
              <div key={product.name} className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] overflow-hidden">
                {/* Product header */}
                <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/8 bg-white/3">
                  <span className="text-xl">{CATEGORY_ICONS[product.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-semibold text-foreground">{product.name}</div>
                    <div className="text-xs text-muted">
                      In-house at {carriedCount} of {DISTRIBUTORS.length} distributors
                      {lowest !== highest && ` · $${lowest.toFixed(2)}–$${highest.toFixed(2)}/${product.offers[0].unit}`}
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_COLORS[product.category]}`}>
                    {product.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Distributor coverage strip — every tracked distributor, carried or not */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/8 border-b border-white/8">
                  {DISTRIBUTORS.map(d => {
                    const offer = product.offers.find(o => o.distributor === d.name)
                    const status = !offer ? 'none' : offer.in_stock ? 'in' : 'out'
                    return (
                      <div key={d.name} className="bg-[rgb(var(--surface-container-low))] px-4 py-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${status === 'in' ? 'bg-success' : status === 'out' ? 'bg-[rgb(var(--brand-yellow))]' : 'bg-[rgb(var(--outline))]'}`} />
                          <span className="text-xs font-semibold text-foreground truncate">{d.name}</span>
                        </div>
                        {status === 'in' && (
                          <div className="text-sm font-bold text-foreground">${offer!.price_per_unit.toFixed(2)}<span className="text-[11px] font-normal text-muted">/{offer!.unit}</span></div>
                        )}
                        {status === 'out' && (
                          <div className="text-[11px] font-medium text-[rgb(var(--brand-yellow))]">Out of stock</div>
                        )}
                        {status === 'none' && (
                          <div className="text-[11px] text-[rgb(var(--outline))]">Not carried</div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Offers — all carriers ranked by price */}
                {product.offers.map((offer, i) => (
                  <div key={offer.id} className={`flex items-center gap-4 px-5 py-3 ${i !== product.offers.length - 1 ? 'border-b border-white/8' : ''} hover:bg-white/3 transition-colors`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground truncate">{offer.distributor}</span>
                        {i === 0 && product.offers.length > 1 && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-success/15 text-success px-1.5 py-0.5 rounded-full">Lowest</span>
                        )}
                        {!offer.in_stock && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-failure/15 text-failure px-1.5 py-0.5 rounded-full">Out of stock</span>
                        )}
                      </div>
                      {offer.notes && <div className="text-xs text-muted truncate">{offer.notes}</div>}
                    </div>

                    <div className="text-xs text-muted text-right hidden sm:block w-24">
                      <div>Min {offer.min_order}</div>
                      <div className="text-[rgb(var(--outline))]">{offer.lead_time_days}d lead</div>
                    </div>

                    <div className="text-right w-24">
                      <div className={`text-lg font-bold tracking-tight ${i === 0 && product.offers.length > 1 ? 'text-success' : 'text-foreground'}`}>
                        ${offer.price_per_unit.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-[rgb(var(--outline))]">per {offer.unit}</div>
                    </div>

                    <button
                      onClick={() => handleRequest(offer)}
                      disabled={!offer.in_stock}
                      className="px-3 py-1.5 text-xs font-semibold bg-primary/15 text-primary-bright rounded-lg hover:bg-primary/25 disabled:opacity-40 disabled:hover:bg-primary/15 transition-colors"
                    >
                      Request
                    </button>
                  </div>
                ))}
              </div>
            )
          })}
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
