'use client'
import { useState, useEffect, useCallback } from 'react'
import { MOCK_REQUESTS, MOCK_BIDS, MOCK_PURVEYORS, MOCK_OFFERINGS, MOCK_PANTRY, MOCK_SPECIALS, MOCK_STOREFRONT, type Offering } from './mockData'

const CATEGORIES = ['protein', 'produce', 'dairy', 'dry_goods']

let _requests = [...MOCK_REQUESTS]
let _bids = [...MOCK_BIDS]
let _offerings: Offering[] = [...MOCK_OFFERINGS]
let _pantry = [...MOCK_PANTRY]
let _specials = [...MOCK_SPECIALS]
const _storefront = [...MOCK_STOREFRONT]
let _listeners: Array<() => void> = []

function notifyListeners() {
  _listeners.forEach(fn => fn())
}

/** Normalize a free-text category to one of the known categories. */
export function normalizeCategory(raw: string): string {
  const c = raw.trim().toLowerCase().replace(/[\s-]+/g, '_')
  if (CATEGORIES.includes(c)) return c
  // light fuzzy matching for common words
  if (/meat|beef|pork|chicken|fish|seafood|poultry/.test(c)) return 'protein'
  if (/veg|fruit|herb|green/.test(c)) return 'produce'
  if (/milk|cheese|cream|butter|yogurt/.test(c)) return 'dairy'
  if (/grain|flour|rice|pasta|spice|pantry|dry/.test(c)) return 'dry_goods'
  return 'dry_goods'
}

/**
 * Parse pasted bulk text into pantry items. One item per line, comma-separated:
 *   name, category, quantity
 * Category and quantity are optional. A header line (name,category,...) is skipped.
 */
export function parseBulkPantry(text: string) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .filter((line, i) => !(i === 0 && /^name\s*,/i.test(line)))
    .map(line => {
      const [name, category, quantity] = line.split(',').map(p => (p ?? '').trim())
      return {
        name,
        category: normalizeCategory(category || ''),
        default_quantity: quantity || '',
      }
    })
    .filter(item => item.name)
}

export function useMarketplace() {
  const [requests, setRequests] = useState(_requests)
  const [bids, setBids] = useState(_bids)
  const [offerings, setOfferings] = useState(_offerings)
  const [pantry, setPantry] = useState(_pantry)
  const [specials, setSpecials] = useState(_specials)

  const refresh = useCallback(() => {
    setRequests([..._requests])
    setBids([..._bids])
    setOfferings([..._offerings])
    setPantry([..._pantry])
    setSpecials([..._specials])
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

  const addOffering = (data: Omit<Offering, 'id' | 'created_at'>) => {
    const offering: Offering = { ...data, id: 'o' + Date.now(), created_at: new Date().toISOString() }
    _offerings = [offering, ..._offerings]
    notifyListeners()
  }

  const getOfferingsForPurveyor = (purveyorId: string) =>
    offerings.filter(o => o.purveyor_id === purveyorId)

  // --- Pantry ---
  const addPantryItem = (data: { name: string; category: string; default_quantity: string; seasonal?: boolean; notes?: string }) => {
    const item = {
      id: 'p' + Date.now(),
      name: data.name,
      category: data.category,
      default_quantity: data.default_quantity,
      seasonal: data.seasonal ?? false,
      notes: data.notes ?? '',
      created_at: new Date().toISOString(),
    }
    _pantry = [item, ..._pantry]
    notifyListeners()
  }

  const addPantryBulk = (items: Array<{ name: string; category: string; default_quantity: string }>) => {
    const now = Date.now()
    const mapped = items.map((it, i) => ({
      id: 'p' + (now + i),
      name: it.name,
      category: it.category,
      default_quantity: it.default_quantity,
      seasonal: false,
      notes: '',
      created_at: new Date(now + i).toISOString(),
    }))
    _pantry = [...mapped, ..._pantry]
    notifyListeners()
    return mapped.length
  }

  const removePantryItem = (id: string) => {
    _pantry = _pantry.filter(p => p.id !== id)
    notifyListeners()
  }

  // --- Specials ---
  const addSpecial = (data: { name: string; description: string; price?: number; start_date?: string; end_date?: string }) => {
    const special = {
      id: 's' + Date.now(),
      name: data.name,
      description: data.description,
      price: data.price ?? 0,
      start_date: data.start_date ?? '',
      end_date: data.end_date ?? '',
      active: true,
      created_at: new Date().toISOString(),
    }
    _specials = [special, ..._specials]
    notifyListeners()
  }

  const toggleSpecial = (id: string) => {
    _specials = _specials.map(s => s.id === id ? { ...s, active: !s.active } : s)
    notifyListeners()
  }

  const removeSpecial = (id: string) => {
    _specials = _specials.filter(s => s.id !== id)
    notifyListeners()
  }

  return {
    requests, bids, offerings, pantry, specials, storefront: _storefront,
    purveyors: MOCK_PURVEYORS,
    addRequest, addBid, awardBid, getBidsForRequest,
    addOffering, getOfferingsForPurveyor,
    addPantryItem, addPantryBulk, removePantryItem,
    addSpecial, toggleSpecial, removeSpecial,
  }
}
