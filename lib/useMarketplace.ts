'use client'
import { useState, useEffect, useCallback } from 'react'
import { MOCK_REQUESTS, MOCK_BIDS } from './mockData'

let _requests = [...MOCK_REQUESTS]
let _bids = [...MOCK_BIDS]
let _listeners: Array<() => void> = []

function notifyListeners() {
  _listeners.forEach(fn => fn())
}

export function useMarketplace() {
  const [requests, setRequests] = useState(_requests)
  const [bids, setBids] = useState(_bids)

  const refresh = useCallback(() => {
    setRequests([..._requests])
    setBids([..._bids])
  }, [])

  useEffect(() => {
    _listeners.push(refresh)
    return () => { _listeners = _listeners.filter(fn => fn !== refresh) }
  }, [refresh])

  const addRequest = (data: Omit<typeof _requests[0], 'id' | 'status' | 'created_at'>) => {
    const req = { ...data, id: String(Date.now()), status: 'open', created_at: new Date().toISOString() }
    _requests = [req, ..._requests]
    notifyListeners()
  }

  const addBid = (data: Omit<typeof _bids[0], 'id' | 'status' | 'created_at'>) => {
    const bid = { ...data, id: 'b' + Date.now(), status: 'pending', created_at: new Date().toISOString() }
    _bids = [bid, ..._bids]
    notifyListeners()
  }

  const awardBid = (bidId: string, requestId: string) => {
    _bids = _bids.map(b => {
      if (b.request_id !== requestId) return b
      return { ...b, status: b.id === bidId ? 'winner' : 'loser' }
    })
    _requests = _requests.map(r => r.id === requestId ? { ...r, status: 'awarded' } : r)
    notifyListeners()
  }

  const getBidsForRequest = (requestId: string) =>
    bids.filter(b => b.request_id === requestId).sort((a, b) => a.price_per_unit - b.price_per_unit)

  return { requests, bids, addRequest, addBid, awardBid, getBidsForRequest }
}
