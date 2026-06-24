'use client'
import { formatDistanceToNow } from 'date-fns'

type Bid = {
  id: string; request_id: string; purveyor_name: string; price_per_unit: number;
  unit: string; total_price: number; delivery_date: string; notes?: string;
  status: string; created_at: string;
}

export function BidCard({ bid, rank, onAccept, canAccept }: {
  bid: Bid; rank: number; onAccept?: (bid: Bid) => void; canAccept?: boolean;
}) {
  const isWinner = bid.status === 'winner'
  const isLoser = bid.status === 'loser'

  return (
    <div className={`rounded-xl border p-4 flex items-start justify-between gap-4 transition-all ${
      isWinner ? 'border-success/40 bg-success/8' : isLoser ? 'border-white/8 bg-white/3 opacity-40' : 'border-white/8 bg-[rgb(var(--surface-container-low))]'
    }`}>
      <div className="flex gap-3 items-start flex-1 min-w-0">
        <div className="flex flex-col items-center min-w-[28px]">
          {rank === 1 && !isLoser && <span className="text-sm leading-none">👑</span>}
          <span className="text-[11px] font-bold text-[rgb(var(--outline))]">#{rank}</span>
        </div>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-foreground mb-0.5">{bid.purveyor_name}</div>
          <div className="text-xs text-muted mb-2">
            Delivers {new Date(bid.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          {bid.notes && (
            <div className="text-xs text-muted bg-white/5 px-2.5 py-1.5 rounded-md border-l-2 border-white/10 max-w-xs leading-relaxed">
              {bid.notes}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 min-w-[110px]">
        <div className="text-xl font-bold text-foreground tracking-tight">
          ${bid.price_per_unit.toFixed(2)}<span className="text-sm font-normal text-muted">/{bid.unit}</span>
        </div>
        <div className="text-xs text-muted">${bid.total_price.toLocaleString()} total</div>
        <div className="text-[11px] text-[rgb(var(--outline))] mt-0.5">
          {formatDistanceToNow(new Date(bid.created_at), { addSuffix: true })}
        </div>
        {isWinner && (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-success/15 text-success px-2 py-0.5 rounded-full mt-1">
            ✓ Awarded
          </span>
        )}
        {!isWinner && !isLoser && canAccept && (
          <button
            onClick={() => onAccept?.(bid)}
            className="mt-1 px-3 py-1.5 text-xs font-semibold bg-success text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            Award Bid
          </button>
        )}
      </div>
    </div>
  )
}
