export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
  subcategory: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}

export const categories: Category[] = [
  {
    id: 'fish',
    name: 'Fish',
    icon: '🐟',
    subcategories: [
      { id: 'salmon', name: 'Salmon' },
      { id: 'tuna', name: 'Tuna' },
      { id: 'cod', name: 'Cod' },
      { id: 'seabass', name: 'Sea Bass' },
    ],
  },
  {
    id: 'shellfish',
    name: 'Shellfish',
    icon: '🦐',
    subcategories: [
      { id: 'shrimp', name: 'Shrimp' },
      { id: 'scallop', name: 'Scallop' },
      { id: 'mussel', name: 'Mussel' },
      { id: 'clam', name: 'Clam' },
    ],
  },
  {
    id: 'mollusks',
    name: 'Mollusks',
    icon: '🦑',
    subcategories: [
      { id: 'squid', name: 'Squid' },
      { id: 'octopus', name: 'Octopus' },
      { id: 'cuttlefish', name: 'Cuttlefish' },
    ],
  },
  {
    id: 'delicacies',
    name: 'Delicacies',
    icon: '🍱',
    subcategories: [
      { id: 'caviar', name: 'Caviar' },
      { id: 'roe', name: 'Fish Roe' },
      { id: 'uni', name: 'Sea Urchin' },
    ],
  },
  {
    id: 'lobster',
    name: 'Lobster',
    icon: '🦞',
    subcategories: [
      { id: 'american', name: 'American Lobster' },
      { id: 'spiny', name: 'Spiny Lobster' },
      { id: 'rock', name: 'Rock Lobster' },
    ],
  },
  {
    id: 'octopus',
    name: 'Octopus',
    icon: '🐙',
    subcategories: [
      { id: 'common', name: 'Common Octopus' },
      { id: 'giant', name: 'Giant Pacific' },
      { id: 'baby', name: 'Baby Octopus' },
    ],
  },
  {
    id: 'crab',
    name: 'Crab',
    icon: '🦀',
    subcategories: [
      { id: 'king', name: 'King Crab' },
      { id: 'snow', name: 'Snow Crab' },
      { id: 'dungeness', name: 'Dungeness Crab' },
      { id: 'blue', name: 'Blue Crab' },
    ],
  },
  {
    id: 'caviar',
    name: 'Caviar',
    icon: '🫙',
    subcategories: [
      { id: 'beluga', name: 'Beluga Caviar' },
      { id: 'osetra', name: 'Osetra Caviar' },
      { id: 'sevruga', name: 'Sevruga Caviar' },
    ],
  },
];

export const products: Product[] = [
  // Fish
  {
    id: '1',
    name: 'Fresh Atlantic Salmon',
    price: 25.99,
    unit: 'lb',
    image: 'https://placehold.co/400x400',
    category: 'fish',
    subcategory: 'salmon',
  },
  {
    id: '2',
    name: 'Wild Caught Tuna',
    price: 32.99,
    unit: 'lb',
    image: 'https://placehold.co/400x400',
    category: 'fish',
    subcategory: 'tuna',
  },
  {
    id: '3',
    name: 'Pacific Cod Fillet',
    price: 18.99,
    unit: 'lb',
    image: 'https://placehold.co/400x400',
    category: 'fish',
    subcategory: 'cod',
  },
  // Shellfish
  {
    id: '4',
    name: 'Jumbo Shrimp',
    price: 24.99,
    unit: 'lb',
    image: 'https://placehold.co/400x400',
    category: 'shellfish',
    subcategory: 'shrimp',
  },
  {
    id: '5',
    name: 'Sea Scallops',
    price: 35.99,
    unit: 'lb',
    image: 'https://placehold.co/400x400',
    category: 'shellfish',
    subcategory: 'scallop',
  },
  // Mollusks
  {
    id: '6',
    name: 'Fresh Squid',
    price: 15.99,
    unit: 'lb',
    image: 'https://placehold.co/400x400',
    category: 'mollusks',
    subcategory: 'squid',
  },
  // Delicacies
  {
    id: '7',
    name: 'Premium Caviar',
    price: 199.99,
    unit: 'oz',
    image: 'https://placehold.co/400x400',
    category: 'delicacies',
    subcategory: 'caviar',
  },
  // Lobster
  {
    id: '8',
    name: 'Live Maine Lobster',
    price: 45.99,
    unit: 'lb',
    image: 'https://placehold.co/400x400',
    category: 'lobster',
    subcategory: 'american',
  },
  // Octopus
  {
    id: '9',
    name: 'Fresh Octopus',
    price: 28.99,
    unit: 'lb',
    image: 'https://placehold.co/400x400',
    category: 'octopus',
    subcategory: 'common',
  },
  // Crab
  {
    id: '10',
    name: 'Alaskan King Crab',
    price: 89.99,
    unit: 'lb',
    image: 'https://placehold.co/400x400',
    category: 'crab',
    subcategory: 'king',
  },
  // More products...
];
