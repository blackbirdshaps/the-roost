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
export const MOCK_STOREFRONT = [
  // Farm Stand Cultured Butter — carried by several purveyors at different prices
  { id: 'sf1', purveyor_name: 'Heritage Foods Supply', product_name: 'Farm Stand Cultured Butter', category: 'dairy', price_per_unit: 7.25, unit: 'lb', min_order: '20 lb', lead_time_days: 2, in_stock: true, notes: '83% butterfat, European-style' },
  { id: 'sf2', purveyor_name: 'Golden Valley Dairy Co.', product_name: 'Farm Stand Cultured Butter', category: 'dairy', price_per_unit: 6.80, unit: 'lb', min_order: '40 lb', lead_time_days: 3, in_stock: true, notes: 'Grass-fed, made in small batches' },
  { id: 'sf3', purveyor_name: 'Metro Restaurant Depot', product_name: 'Farm Stand Cultured Butter', category: 'dairy', price_per_unit: 7.95, unit: 'lb', min_order: '10 lb', lead_time_days: 1, in_stock: true, notes: 'Next-day delivery available' },
  { id: 'sf4', purveyor_name: 'Coastal Farms Direct', product_name: 'Farm Stand Cultured Butter', category: 'dairy', price_per_unit: 7.10, unit: 'lb', min_order: '25 lb', lead_time_days: 4, in_stock: false, notes: 'Back in stock next week' },

  // Wagyu Strip Loin
  { id: 'sf5', purveyor_name: 'Heritage Foods Supply', product_name: 'Wagyu Strip Loin', category: 'protein', price_per_unit: 38.50, unit: 'lb', min_order: '20 lb', lead_time_days: 3, in_stock: true, notes: 'USDA Prime, 28-day dry aged' },
  { id: 'sf6', purveyor_name: 'Pacific Rim Provisions', product_name: 'Wagyu Strip Loin', category: 'protein', price_per_unit: 34.00, unit: 'lb', min_order: '30 lb', lead_time_days: 5, in_stock: true, notes: 'Australian Wagyu, 21-day aged' },

  // Heirloom Tomatoes
  { id: 'sf7', purveyor_name: 'Coastal Farms Direct', product_name: 'Heirloom Tomatoes', category: 'produce', price_per_unit: 4.20, unit: 'lb', min_order: '15 lb', lead_time_days: 1, in_stock: true, notes: 'Mixed varieties, Sonoma County' },
  { id: 'sf8', purveyor_name: 'Green Acres Produce', product_name: 'Heirloom Tomatoes', category: 'produce', price_per_unit: 3.85, unit: 'lb', min_order: '25 lb', lead_time_days: 2, in_stock: true, notes: 'Certified organic' },

  // Single-purveyor items
  { id: 'sf9', purveyor_name: 'Golden Valley Dairy Co.', product_name: 'Burrata', category: 'dairy', price_per_unit: 5.50, unit: 'unit', min_order: '12 units', lead_time_days: 1, in_stock: true, notes: 'Fresh daily, 4oz each' },
  { id: 'sf10', purveyor_name: 'Pantry Wholesale', product_name: 'Arborio Rice', category: 'dry_goods', price_per_unit: 2.10, unit: 'lb', min_order: '50 lb', lead_time_days: 3, in_stock: true, notes: 'Vialone Nano available too' },
  { id: 'sf11', purveyor_name: 'Green Acres Produce', product_name: 'Ramps', category: 'produce', price_per_unit: 12.00, unit: 'lb', min_order: '5 lb', lead_time_days: 2, in_stock: true, notes: 'Foraged, spring season only' },
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
