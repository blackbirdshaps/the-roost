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

export const MOCK_PANTRY = [
  { id: 'p1', name: 'Yukon Gold Potatoes', category: 'produce', default_quantity: '50 lbs', seasonal: false, notes: '', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'p2', name: 'Chicken Breast', category: 'protein', default_quantity: '60 lbs', seasonal: false, notes: 'Air-chilled preferred', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'p3', name: 'Heavy Cream', category: 'dairy', default_quantity: '8 gal', seasonal: false, notes: '', created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 'p4', name: 'All-Purpose Flour', category: 'dry_goods', default_quantity: '100 lbs', seasonal: false, notes: '', created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: 'p5', name: 'Ramps', category: 'produce', default_quantity: '10 lbs', seasonal: true, notes: 'Spring only', created_at: new Date(Date.now() - 43200000).toISOString() },
]

// Purveyor Storefront: each row is one purveyor offering one product at a price.
// Multiple purveyors can list the same product — that's what powers price
// comparison (search a product, see who carries it and for how much).
// The major broadline / specialty distributors we track for in-house coverage.
// `specialty` flags the limited-catalog houses (e.g. Pierless = seafood only),
// which is why they won't carry every product searched.
export const DISTRIBUTORS = [
  { name: 'Baldor', kind: 'broadline' },
  { name: 'Pierless Fish', kind: 'seafood' },
  { name: 'Sysco', kind: 'broadline' },
  { name: 'US Foods', kind: 'broadline' },
] as const

// Purveyor Storefront: each row is one distributor offering one product at a
// price. Multiple distributors carry the same product — that's what powers both
// price comparison and the per-product distributor coverage view (who has it
// in-house). A distributor with no row for a product simply doesn't carry it.
export const MOCK_STOREFRONT = [
  // Farm Stand Cultured Butter (dairy) — Pierless (seafood) doesn't carry it
  { id: 'sf1', distributor: 'Sysco', product_name: 'Farm Stand Cultured Butter', category: 'dairy', price_per_unit: 6.80, unit: 'lb', min_order: '40 lb', lead_time_days: 3, in_stock: true, notes: 'Grade AA, salted or unsalted' },
  { id: 'sf2', distributor: 'Baldor', product_name: 'Farm Stand Cultured Butter', category: 'dairy', price_per_unit: 6.95, unit: 'lb', min_order: '20 lb', lead_time_days: 2, in_stock: true, notes: '83% butterfat, European-style' },
  { id: 'sf3', distributor: 'US Foods', product_name: 'Farm Stand Cultured Butter', category: 'dairy', price_per_unit: 7.20, unit: 'lb', min_order: '30 lb', lead_time_days: 2, in_stock: false, notes: 'Restocking — ships in 5 days' },

  // Wagyu Strip Loin (protein) — Pierless (seafood) doesn't carry it
  { id: 'sf4', distributor: 'Sysco', product_name: 'Wagyu Strip Loin', category: 'protein', price_per_unit: 35.50, unit: 'lb', min_order: '30 lb', lead_time_days: 4, in_stock: true, notes: 'USDA Prime' },
  { id: 'sf5', distributor: 'Baldor', product_name: 'Wagyu Strip Loin', category: 'protein', price_per_unit: 37.00, unit: 'lb', min_order: '20 lb', lead_time_days: 3, in_stock: true, notes: '28-day dry aged' },
  { id: 'sf6', distributor: 'US Foods', product_name: 'Wagyu Strip Loin', category: 'protein', price_per_unit: 36.25, unit: 'lb', min_order: '25 lb', lead_time_days: 5, in_stock: true, notes: 'Australian Wagyu, MB5+' },

  // Maine Mussels (protein/seafood) — Pierless's specialty; US Foods doesn't carry
  { id: 'sf7', distributor: 'Pierless Fish', product_name: 'Maine Mussels', category: 'protein', price_per_unit: 4.50, unit: 'lb', min_order: '10 lb', lead_time_days: 1, in_stock: true, notes: 'Rope-grown, harvested daily' },
  { id: 'sf8', distributor: 'Sysco', product_name: 'Maine Mussels', category: 'protein', price_per_unit: 4.95, unit: 'lb', min_order: '20 lb', lead_time_days: 2, in_stock: true, notes: 'PEI mussels' },
  { id: 'sf9', distributor: 'Baldor', product_name: 'Maine Mussels', category: 'protein', price_per_unit: 5.25, unit: 'lb', min_order: '15 lb', lead_time_days: 2, in_stock: true, notes: 'Wild-harvested' },

  // Heirloom Tomatoes (produce) — Baldor's strength; Pierless doesn't carry
  { id: 'sf10', distributor: 'Baldor', product_name: 'Heirloom Tomatoes', category: 'produce', price_per_unit: 3.95, unit: 'lb', min_order: '15 lb', lead_time_days: 1, in_stock: true, notes: 'Mixed varieties, Hudson Valley' },
  { id: 'sf11', distributor: 'Sysco', product_name: 'Heirloom Tomatoes', category: 'produce', price_per_unit: 4.10, unit: 'lb', min_order: '25 lb', lead_time_days: 2, in_stock: true, notes: 'Greenhouse-grown' },
  { id: 'sf12', distributor: 'US Foods', product_name: 'Heirloom Tomatoes', category: 'produce', price_per_unit: 4.25, unit: 'lb', min_order: '20 lb', lead_time_days: 2, in_stock: true, notes: 'Field-grown, seasonal' },

  // Burrata (dairy)
  { id: 'sf13', distributor: 'Baldor', product_name: 'Burrata', category: 'dairy', price_per_unit: 5.25, unit: 'unit', min_order: '12 units', lead_time_days: 1, in_stock: true, notes: 'Fresh daily, 4oz each' },
  { id: 'sf14', distributor: 'Sysco', product_name: 'Burrata', category: 'dairy', price_per_unit: 5.40, unit: 'unit', min_order: '24 units', lead_time_days: 2, in_stock: false, notes: 'Temporarily out' },
  { id: 'sf15', distributor: 'US Foods', product_name: 'Burrata', category: 'dairy', price_per_unit: 5.60, unit: 'unit', min_order: '12 units', lead_time_days: 2, in_stock: true, notes: 'Imported, 4oz' },

  // Arborio Rice (dry_goods) — broadline staple; Pierless doesn't carry
  { id: 'sf16', distributor: 'Sysco', product_name: 'Arborio Rice', category: 'dry_goods', price_per_unit: 1.95, unit: 'lb', min_order: '50 lb', lead_time_days: 3, in_stock: true, notes: 'Imported Italian' },
  { id: 'sf17', distributor: 'US Foods', product_name: 'Arborio Rice', category: 'dry_goods', price_per_unit: 2.05, unit: 'lb', min_order: '50 lb', lead_time_days: 3, in_stock: true, notes: 'Vialone Nano available' },
  { id: 'sf18', distributor: 'Baldor', product_name: 'Arborio Rice', category: 'dry_goods', price_per_unit: 2.15, unit: 'lb', min_order: '25 lb', lead_time_days: 2, in_stock: true, notes: 'Carnaroli also stocked' },

  // Ramps (produce) — Baldor only (seasonal specialty)
  { id: 'sf19', distributor: 'Baldor', product_name: 'Ramps', category: 'produce', price_per_unit: 11.50, unit: 'lb', min_order: '5 lb', lead_time_days: 2, in_stock: true, notes: 'Foraged, spring season only' },
]

export const MOCK_SPECIALS = [
  { id: 's1', name: 'Spring Ramp Risotto', description: 'Carnaroli rice, foraged ramps, aged parmesan', price: 28, start_date: '2026-06-20', end_date: '2026-07-15', active: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 's2', name: 'Dry-Aged Ribeye Friday', description: '45-day dry-aged ribeye, bone marrow butter', price: 64, start_date: '2026-06-01', end_date: '', active: true, created_at: new Date(Date.now() - 172800000).toISOString() },
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
