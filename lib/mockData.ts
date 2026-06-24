export const MOCK_REQUESTS = [
  {
    id: '1',
    restaurant_name: 'The Larder',
    category: 'protein',
    item: 'Wagyu Strip Loin',
    quantity: '40 lbs',
    needed_by: '2026-06-28',
    notes: 'Must be USDA Prime, dry-aged minimum 21 days',
    status: 'open',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    restaurant_name: 'Oleander',
    category: 'produce',
    item: 'Heirloom Tomatoes',
    quantity: '25 lbs',
    needed_by: '2026-06-26',
    notes: 'Mixed varieties, no Roma',
    status: 'open',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    restaurant_name: 'Salt & Stone',
    category: 'dairy',
    item: 'Burrata',
    quantity: '12 units (4oz each)',
    needed_by: '2026-06-27',
    notes: 'Fresh, same-day delivery preferred',
    status: 'open',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '4',
    restaurant_name: 'Provision',
    category: 'dry_goods',
    item: 'Arborio Rice',
    quantity: '50 lbs',
    needed_by: '2026-07-01',
    notes: 'Vialone Nano acceptable',
    status: 'open',
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
]

// ---------------------------------------------------------------------------
// Purveyor portal: purveyors offer what they have (or will soon have), at a
// quality grade, with delivery options — proactively, before any request.
// ---------------------------------------------------------------------------

export type Grade = 'standard' | 'high_grade'
export type Availability = 'on_hand' | 'next_day' | 'within_3_days' | 'within_5_days'
export type DeliveryOption = 'pickup' | 'same_day' | 'next_day' | 'three_day'

export const GRADE_LABELS: Record<Grade, string> = {
  standard: 'Standard',
  high_grade: 'High-grade',
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  on_hand: 'On hand now',
  next_day: 'Available next day',
  within_3_days: 'Within 3 days',
  within_5_days: 'Within 5 days',
}

export const DELIVERY_LABELS: Record<DeliveryOption, string> = {
  pickup: 'Pickup',
  same_day: 'Local same-day',
  next_day: 'Next-day',
  three_day: '3-day delivery',
}

export interface Purveyor {
  id: string
  name: string
  emoji: string
  tagline: string
  focus: string[]
}

export interface Offering {
  id: string
  purveyor_id: string
  item: string
  category: 'protein' | 'produce' | 'dairy' | 'dry_goods'
  grade: Grade
  availability: Availability
  delivery_options: DeliveryOption[]
  quantity: string
  unit: string
  price_per_unit: number
  notes?: string
  created_at: string
}

export const MOCK_PURVEYORS: Purveyor[] = [
  {
    id: 'p1',
    name: "Rachel's Farm Stand",
    emoji: '🥬',
    tagline: 'Small-batch produce & farmstead dairy from Sonoma County',
    focus: ['produce', 'dairy'],
  },
  {
    id: 'p2',
    name: "Timothy's Cattle Ranch",
    emoji: '🐄',
    tagline: 'Pasture-raised beef & raw dairy, dry-aged on site',
    focus: ['protein', 'dairy'],
  },
]

export const MOCK_OFFERINGS: Offering[] = [
  // Rachel's Farm Stand — produce & dairy
  {
    id: 'o1', purveyor_id: 'p1', item: 'Heirloom Tomatoes', category: 'produce',
    grade: 'high_grade', availability: 'on_hand', delivery_options: ['pickup', 'same_day'],
    quantity: '30 lbs', unit: 'lb', price_per_unit: 4.5,
    notes: 'Mixed Sonoma varieties, picked this morning',
    created_at: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 'o2', purveyor_id: 'p1', item: 'Rainbow Chard', category: 'produce',
    grade: 'standard', availability: 'on_hand', delivery_options: ['pickup', 'same_day', 'next_day'],
    quantity: '20 cases', unit: 'case', price_per_unit: 18,
    created_at: new Date(Date.now() - 9000000).toISOString(),
  },
  {
    id: 'o3', purveyor_id: 'p1', item: 'Farmstead Cultured Butter', category: 'dairy',
    grade: 'high_grade', availability: 'within_3_days', delivery_options: ['next_day', 'three_day'],
    quantity: '40 lbs', unit: 'lb', price_per_unit: 7,
    notes: 'European-style, 84% butterfat',
    created_at: new Date(Date.now() - 12600000).toISOString(),
  },
  {
    id: 'o4', purveyor_id: 'p1', item: 'Fresh Chèvre', category: 'dairy',
    grade: 'standard', availability: 'next_day', delivery_options: ['pickup', 'next_day'],
    quantity: '24 units (5oz each)', unit: 'unit', price_per_unit: 5.5,
    created_at: new Date(Date.now() - 16200000).toISOString(),
  },
  // Timothy's Cattle Ranch — protein & dairy
  {
    id: 'o5', purveyor_id: 'p2', item: 'Dry-Aged Ribeye', category: 'protein',
    grade: 'high_grade', availability: 'within_3_days', delivery_options: ['next_day', 'three_day'],
    quantity: '50 lbs', unit: 'lb', price_per_unit: 32,
    notes: 'USDA Prime, 28-day dry aged',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'o6', purveyor_id: 'p2', item: 'Ground Chuck', category: 'protein',
    grade: 'standard', availability: 'on_hand', delivery_options: ['pickup', 'same_day', 'next_day'],
    quantity: '80 lbs', unit: 'lb', price_per_unit: 6.5,
    notes: '80/20, ground fresh daily',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'o7', purveyor_id: 'p2', item: 'Grass-Fed Strip Loin', category: 'protein',
    grade: 'high_grade', availability: 'within_5_days', delivery_options: ['three_day'],
    quantity: '40 lbs', unit: 'lb', price_per_unit: 24,
    notes: 'Whole loins, pasture-finished',
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'o8', purveyor_id: 'p2', item: 'Raw Jersey Milk', category: 'dairy',
    grade: 'standard', availability: 'next_day', delivery_options: ['pickup', 'next_day'],
    quantity: '30 units (1 gal)', unit: 'unit', price_per_unit: 9,
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
]

export const MOCK_BIDS = [
  {
    id: 'b1',
    request_id: '1',
    purveyor_name: 'Heritage Foods Supply',
    price_per_unit: 38.5,
    unit: 'lb',
    total_price: 1540,
    delivery_date: '2026-06-27',
    notes: 'Certified USDA Prime, 28-day dry aged',
    status: 'pending',
    created_at: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: 'b2',
    request_id: '1',
    purveyor_name: 'Pacific Rim Provisions',
    price_per_unit: 34.0,
    unit: 'lb',
    total_price: 1360,
    delivery_date: '2026-06-28',
    notes: 'Australian Wagyu, 21-day aged',
    status: 'pending',
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'b3',
    request_id: '2',
    purveyor_name: 'Coastal Farms Direct',
    price_per_unit: 4.2,
    unit: 'lb',
    total_price: 105,
    delivery_date: '2026-06-26',
    notes: 'Mixed heirlooms from Sonoma County',
    status: 'pending',
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
]
