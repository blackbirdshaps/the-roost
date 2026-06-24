'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  MOCK_REQUESTS, MOCK_BIDS, MOCK_PURVEYORS, MOCK_OFFERINGS, MOCK_PANTRY,
  MOCK_SPECIALS, MOCK_STOREFRONT, MOCK_RECIPES, MOCK_SUBSCRIPTIONS, MOCK_SUB_BIDS,
  type Offering, type PantryItem, type Recipe, type Subscription, type SubBid,
} from './mockData'

const CATEGORIES = ['protein', 'produce', 'dairy', 'dry_goods']

let _requests = [...MOCK_REQUESTS]
let _bids = [...MOCK_BIDS]
let _offerings: Offering[] = [...MOCK_OFFERINGS]
let _pantry: PantryItem[] = [...MOCK_PANTRY]
let _specials = [...MOCK_SPECIALS]
const _storefront = [...MOCK_STOREFRONT]
let _recipes: Recipe[] = [...MOCK_RECIPES]
let _subscriptions: Subscription[] = [...MOCK_SUBSCRIPTIONS]
let _subBids: SubBid[] = [...MOCK_SUB_BIDS]
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
  const [recipes, setRecipes] = useState(_recipes)
  const [subscriptions, setSubscriptions] = useState(_subscriptions)
  const [subBids, setSubBids] = useState(_subBids)

  const refresh = useCallback(() => {
    setRequests([..._requests])
    setBids([..._bids])
    setOfferings([..._offerings])
    setPantry([..._pantry])
    setSpecials([..._specials])
    setRecipes([..._recipes])
    setSubscriptions([..._subscriptions])
    setSubBids([..._subBids])
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
  const addPantryItem = (data: { name: string; category: string; default_quantity: string; seasonal?: boolean; notes?: string; usage_qty?: number; usage_unit?: string; usage_period_days?: number }) => {
    const item: PantryItem = {
      id: 'p' + Date.now(),
      name: data.name,
      category: data.category,
      default_quantity: data.default_quantity,
      seasonal: data.seasonal ?? false,
      notes: data.notes ?? '',
      created_at: new Date().toISOString(),
      usage_qty: data.usage_qty,
      usage_unit: data.usage_unit,
      usage_period_days: data.usage_period_days,
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

  // --- Recipes ---
  const addRecipe = (data: Omit<Recipe, 'id' | 'created_at'>) => {
    const recipe: Recipe = { ...data, id: 'r' + Date.now(), created_at: new Date().toISOString() }
    _recipes = [recipe, ..._recipes]
    notifyListeners()
  }

  const removeRecipe = (id: string) => {
    _recipes = _recipes.filter(r => r.id !== id)
    notifyListeners()
  }

  // --- Subscriptions ---
  const addSubscription = (data: Omit<Subscription, 'id' | 'status' | 'created_at'>) => {
    const sub: Subscription = { ...data, id: 'sub' + Date.now(), status: 'open', created_at: new Date().toISOString() }
    _subscriptions = [sub, ..._subscriptions]
    notifyListeners()
  }

  const addSubBid = (data: Omit<SubBid, 'id' | 'status' | 'created_at'>) => {
    const bid: SubBid = { ...data, id: 'sb' + Date.now(), status: 'pending', created_at: new Date().toISOString() }
    _subBids = [bid, ..._subBids]
    notifyListeners()
  }

  const awardSubBid = (bidId: string, subscriptionId: string) => {
    _subBids = _subBids.map(b => {
      if (b.subscription_id !== subscriptionId) return b
      return { ...b, status: b.id === bidId ? 'winner' : 'loser' }
    })
    _subscriptions = _subscriptions.map(s => s.id === subscriptionId ? { ...s, status: 'awarded' } : s)
    notifyListeners()
  }

  const getSubBidsForSubscription = (subscriptionId: string) =>
    subBids.filter(b => b.subscription_id === subscriptionId).sort((a, b) => a.price_per_unit - b.price_per_unit)

  // --- Reorder suggestions (derived from pantry usage rates) ---
  // For each pantry item with a usage rate, project a week of demand and a
  // "reorder by" date a day before the current quantity runs out.
  const getReorderSuggestions = () =>
    pantry
      .filter(p => p.usage_qty && p.usage_period_days)
      .map(p => {
        const dailyUse = p.usage_qty! / p.usage_period_days!
        const suggestQty = Math.ceil(dailyUse * 7)
        const orderByDays = Math.max(1, p.usage_period_days! - 1)
        const orderBy = new Date(Date.now() + orderByDays * 86400000).toISOString().slice(0, 10)
        return {
          id: p.id,
          item: p.name,
          category: p.category,
          unit: p.usage_unit ?? '',
          dailyUse: Math.round(dailyUse * 10) / 10,
          suggestQty,
          orderBy,
          rationale: `Uses ~${p.usage_qty} ${p.usage_unit} every ${p.usage_period_days} day${p.usage_period_days! > 1 ? 's' : ''} (~${Math.round(dailyUse * 10) / 10} ${p.usage_unit}/day). Order ~${suggestQty} ${p.usage_unit} to cover the next week.`,
        }
      })

  return {
    requests, bids, offerings, pantry, specials, storefront: _storefront,
    purveyors: MOCK_PURVEYORS, recipes, subscriptions, subBids,
    addRequest, addBid, awardBid, getBidsForRequest,
    addOffering, getOfferingsForPurveyor,
    addPantryItem, addPantryBulk, removePantryItem,
    addSpecial, toggleSpecial, removeSpecial,
    addRecipe, removeRecipe,
    addSubscription, addSubBid, awardSubBid, getSubBidsForSubscription,
    getReorderSuggestions,
  }
}
