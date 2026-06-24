'use client'
import { useState } from 'react'
import { RestaurantView } from './RestaurantView'
import { PurveyorView } from './PurveyorView'

export function Marketplace() {
  const [role, setRole] = useState<'restaurant' | 'purveyor'>('restaurant')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgb(var(--surface-bg-darker))] border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L8 8l4 2 4-2-4-6zM6 10l-3 5h6l-3-5zM18 10l-3 5h6l-3-5zM9 16l3 6 3-6H9z" fill="rgb(var(--core-primary))" />
            </svg>
            <span className="text-[16px] font-bold tracking-tight text-foreground">The Roost</span>
            <span className="text-[11px] text-[rgb(var(--outline))] pl-2.5 border-l border-white/8 ml-0.5 whitespace-nowrap">
              Procurement Marketplace
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl p-1">
            <button
              onClick={() => setRole('restaurant')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                role === 'restaurant'
                  ? 'bg-[rgb(var(--surface-container-high))] text-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              🍽 Restaurant
            </button>
            <button
              onClick={() => setRole('purveyor')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                role === 'purveyor'
                  ? 'bg-[rgb(var(--surface-container-high))] text-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              🚚 Purveyor
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            Live
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {role === 'restaurant' ? <RestaurantView /> : <PurveyorView />}
      </main>
    </div>
  )
}
