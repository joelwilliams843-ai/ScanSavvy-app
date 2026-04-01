export interface Coupon {
  id: string;
  store: string;
  discount: string;
  description: string;
  claimed: number;
  badge?: 'HOT' | 'NEW';
  category: string;
  value: number;
  expiresAt: string;
}

export interface Store {
  id: string;
  name: string;
  loyaltyProgram: string;
  connected: boolean;
}

export interface SavingsVisit {
  id: string;
  store: string;
  date: string;
  couponsUsed: number;
  amountSaved: number;
  coupons: string[];
}

export interface ActivityUser {
  name: string;
  amount: number;
  stores: string[];
}

export const MOCK_COUPONS: Coupon[] = [
  {
    id: '1',
    store: 'Target',
    discount: '25% OFF',
    description: 'All Household Essentials',
    claimed: 2340,
    badge: 'HOT',
    category: 'Household',
    value: 25,
    expiresAt: '2024-12-31',
  },
  {
    id: '2',
    store: 'Walmart',
    discount: '$10 OFF $50',
    description: 'Grocery Purchases',
    claimed: 1892,
    badge: 'NEW',
    category: 'Grocery',
    value: 10,
    expiresAt: '2024-12-31',
  },
  {
    id: '3',
    store: 'Kroger',
    discount: 'BOGO Free',
    description: 'Select Snacks & Beverages',
    claimed: 1567,
    category: 'Grocery',
    value: 15,
    expiresAt: '2024-12-31',
  },
  {
    id: '4',
    store: 'CVS',
    discount: '40% OFF',
    description: 'Health & Wellness Items',
    claimed: 987,
    category: 'Personal Care',
    value: 40,
    expiresAt: '2024-12-31',
  },
  {
    id: '5',
    store: 'Walgreens',
    discount: '$5 OFF $20',
    description: 'Beauty Purchase',
    claimed: 743,
    category: 'Beauty',
    value: 5,
    expiresAt: '2024-12-31',
  },
  {
    id: '6',
    store: 'Target',
    discount: '30% OFF',
    description: 'Apparel & Accessories',
    claimed: 1234,
    category: 'Household',
    value: 30,
    expiresAt: '2024-12-31',
  },
  {
    id: '7',
    store: 'Walmart',
    discount: '$15 OFF $75',
    description: 'Electronics',
    claimed: 892,
    category: 'Household',
    value: 15,
    expiresAt: '2024-12-31',
  },
  {
    id: '8',
    store: 'Kroger',
    discount: '20% OFF',
    description: 'Organic Produce',
    claimed: 2100,
    badge: 'HOT',
    category: 'Grocery',
    value: 20,
    expiresAt: '2024-12-31',
  },
];

export const MOCK_STORES: Store[] = [
  {
    id: '1',
    name: 'Walmart',
    loyaltyProgram: 'Walmart+',
    connected: false,
  },
  {
    id: '2',
    name: 'Target',
    loyaltyProgram: 'Target Circle',
    connected: false,
  },
  {
    id: '3',
    name: 'Kroger',
    loyaltyProgram: 'Kroger Plus Card',
    connected: false,
  },
  {
    id: '4',
    name: 'CVS',
    loyaltyProgram: 'CVS ExtraCare',
    connected: false,
  },
  {
    id: '5',
    name: 'Walgreens',
    loyaltyProgram: 'myWalgreens',
    connected: false,
  },
];

export const MOCK_USER = {
  name: 'Alex',
  email: 'alex@example.com',
  totalSaved: 284.50,
  linkedStores: ['Kroger', 'Target', 'CVS'],
};

export const MOCK_SAVINGS_VISITS: SavingsVisit[] = [
  {
    id: '1',
    store: 'Kroger',
    date: '2024-07-15',
    couponsUsed: 8,
    amountSaved: 47.50,
    coupons: ['BOGO Free Snacks', '20% OFF Organic Produce'],
  },
  {
    id: '2',
    store: 'Target',
    date: '2024-07-10',
    couponsUsed: 5,
    amountSaved: 32.80,
    coupons: ['25% OFF Household Essentials', '30% OFF Apparel'],
  },
  {
    id: '3',
    store: 'CVS',
    date: '2024-07-08',
    couponsUsed: 3,
    amountSaved: 18.20,
    coupons: ['40% OFF Health & Wellness'],
  },
  {
    id: '4',
    store: 'Walmart',
    date: '2024-07-05',
    couponsUsed: 6,
    amountSaved: 55.00,
    coupons: ['$10 OFF $50 Grocery', '$15 OFF $75 Electronics'],
  },
  {
    id: '5',
    store: 'Target',
    date: '2024-07-01',
    couponsUsed: 4,
    amountSaved: 28.50,
    coupons: ['25% OFF Household Essentials'],
  },
];

export const MOCK_ACTIVITY: ActivityUser[] = [
  {
    name: 'Sarah M.',
    amount: 156,
    stores: ['Target', 'Kroger'],
  },
  {
    name: 'James T.',
    amount: 142,
    stores: ['Walmart', 'CVS'],
  },
  {
    name: 'Maria L.',
    amount: 128,
    stores: ['Publix', 'Costco'],
  },
];

export const COMMUNITY_STATS = {
  totalSaved: 47230,
  couponsRedeemed: 12450,
  avgSavings: 18.92,
};

export const CATEGORIES = [
  'All',
  'Grocery',
  'Personal Care',
  'Household',
  'Beauty',
  'Pharmacy',
];
