'use client'
import { formatDistanceToNow, format } from 'date-fns'

const CATEGORY_ICONS: Record<string, string> = {
  protein: '🥩', produce: '🥬', dairy: '🧀', dry_goods: '🌾',
}

const CATEGORY_COLORS: Record<string, string> = {
  protein:   'bg-red-500/15 text-red-400',
  produce:   'bg-green-500/15 text-green-400',
  dairy:     'bg-yellow-500/15 text-yellow-400',
  dry_goods: 'bg-purple-500/15 text-purple-400',
}

type Request = {
  id: string; restaurant_name: string; category: string; item: string;
  quantity: string; needed_by: string; notes?: string; status: string; created_at: string;
}

export function RequestCard({ request, selected, onClick, bidCount = 0 }: {
  request: Request; selected?: boolean; onClick?: () => void; bidCount?: number;
}) {
  const isUrgent = new Date(request.needed_by).getTime() - Date.now() < 48 * 3600 * 1000

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 cursor-pointer transition-all ${
        selected
          ? 'border-primary/60 bg-primary/10'
          : 'border-white/8 bg-[rgb(var(--surface-container-low))] hover:border-white/16 hover:bg-[rgb(var(--surface-container))]'
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <span>{CATEGORY_ICONS[request.category] || '📦'}</span>
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_COLORS[request.category]}`}>
            {request.category.replace('_', ' ')}
          </span>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          request.status === 'open' ? 'bg-primary/15 text-primary-bright'
          : request.status === 'awarded' ? 'bg-success/15 text-success'
          : 'bg-white/8 text-muted'
        }`}>
          {request.status}
        </span>
      </div>

      <div className="text-[15px] font-semibold text-foreground mb-0.5">{request.item}</div>
      <div className="text-xs text-muted mb-3">{request.restaurant_name}</div>

      <div className="flex gap-4 mb-2.5">
        <span className="text-xs text-muted flex items-center gap-1">⚖️ {request.quantity}</span>
        <span className={`text-xs flex items-center gap-1.5 ${isUrgent ? 'text-[rgb(var(--brand-yellow))]' : 'text-muted'}`}>
          📅 {format(new Date(request.needed_by), 'MMM d')}
          {isUrgent && <span className="text-[9px] font-bold uppercase tracking-wider bg-yellow-500/15 px-1.5 py-0.5 rounded-full">Urgent</span>}
        </span>
      </div>

      {request.notes && (
        <div className="text-xs text-muted bg-white/5 rounded-md px-2.5 py-2 mb-2.5 border-l-2 border-white/10 leading-relaxed">
          {request.notes}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-[rgb(var(--outline))]">
          {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
        </span>
        {bidCount > 0 && (
          <span className="text-[11px] font-semibold text-primary-bright bg-primary/15 px-2 py-0.5 rounded-full">
            {bidCount} bid{bidCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
