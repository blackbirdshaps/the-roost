'use client'
import {
  type Offering,
  GRADE_LABELS,
  AVAILABILITY_LABELS,
  DELIVERY_LABELS,
} from '../../lib/mockData'

const CATEGORY_ICONS: Record<string, string> = {
  protein: '🥩', produce: '🥬', dairy: '🧀', dry_goods: '🌾',
}

const CATEGORY_STYLES: Record<string, string> = {
  protein: 'bg-red-500/15 text-red-400',
  produce: 'bg-green-500/15 text-green-400',
  dairy: 'bg-yellow-500/15 text-yellow-400',
  dry_goods: 'bg-purple-500/15 text-purple-400',
}

// "On hand now" reads as immediately available (green); future windows are amber.
const AVAILABILITY_STYLES: Record<string, string> = {
  on_hand: 'bg-success/15 text-success',
  next_day: 'bg-blue-500/15 text-blue-400',
  within_3_days: 'bg-yellow-500/15 text-yellow-400',
  within_5_days: 'bg-orange-500/15 text-orange-400',
}

export function OfferingCard({ offering }: { offering: Offering }) {
  return (
    <div className="rounded-xl border border-white/8 bg-[rgb(var(--surface-container-low))] p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
          {CATEGORY_ICONS[offering.category] || '📦'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex ${CATEGORY_STYLES[offering.category]}`}>
              {offering.category.replace('_', ' ')}
            </span>
            {offering.grade === 'high_grade' && (
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex bg-primary/20 text-primary">
                ★ {GRADE_LABELS[offering.grade]}
              </span>
            )}
          </div>
          <div className="text-[15px] font-bold text-foreground tracking-tight leading-tight mt-1">{offering.item}</div>
          <div className="text-xs text-muted mt-0.5">{offering.quantity} available</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-[15px] font-bold text-foreground">${offering.price_per_unit.toFixed(2)}</div>
          <div className="text-[11px] text-muted">/{offering.unit}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${AVAILABILITY_STYLES[offering.availability]}`}>
          {offering.availability === 'on_hand' ? '●' : '◷'} {AVAILABILITY_LABELS[offering.availability]}
        </span>
        {offering.grade === 'standard' && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-muted">
            {GRADE_LABELS[offering.grade]}
          </span>
        )}
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[rgb(var(--outline))] mb-1.5">Delivery</p>
        <div className="flex flex-wrap gap-1.5">
          {offering.delivery_options.map(opt => (
            <span key={opt} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 text-muted border border-white/8">
              🚚 {DELIVERY_LABELS[opt]}
            </span>
          ))}
        </div>
      </div>

      {offering.notes && (
        <p className="text-xs text-muted leading-relaxed border-l-2 border-primary/40 pl-2.5">{offering.notes}</p>
      )}
    </div>
  )
}
