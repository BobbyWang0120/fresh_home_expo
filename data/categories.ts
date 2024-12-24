export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  originalPrice: number;
  unit: string;
  origin: string;
  image: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'shrimp',
    name: '虾',
    nameEn: 'Shrimp',
    icon: '🦐',
  },
  {
    id: 'lobster',
    name: '龙虾',
    nameEn: 'Lobster',
    icon: '🦞',
  },
  {
    id: 'crab',
    name: '蟹',
    nameEn: 'Crab',
    icon: '🦀',
  },
  {
    id: 'mantis_shrimp',
    name: '皮皮虾',
    nameEn: 'Mantis Shrimp',
    icon: '🦐',
  },
  {
    id: 'shellfish',
    name: '贝类',
    nameEn: 'Shellfish',
    icon: '🦪',
  },
  {
    id: 'fish',
    name: '鱼类',
    nameEn: 'Fish',
    icon: '🐟',
  },
];

// 从CSV数据生成商品列表
export const products: Product[] = [
  {
    id: '1',
    name: '基围虾',
    nameEn: 'Greasyback Shrimp',
    price: 26.99,
    originalPrice: 20.0,
    unit: 'lb',
    origin: 'Florida',
    image: 'https://example.com/shrimp1.jpg',
    category: 'shrimp',
  },
  {
    id: '2',
    name: '竹节虾',
    nameEn: 'Ridgeback Shrimp',
    price: 7.99,
    originalPrice: 7.5,
    unit: 'lb',
    origin: 'California',
    image: 'https://example.com/shrimp2.jpg',
    category: 'shrimp',
  },
  {
    id: '3',
    name: '珊瑚虾',
    nameEn: 'Spot Prawn Shrimp',
    price: 48.0,
    originalPrice: 35.0,
    unit: 'lb',
    origin: 'California',
    image: 'https://example.com/shrimp3.jpg',
    category: 'shrimp',
  },
  {
    id: '4',
    name: '波士顿龙虾(3~4磅)',
    nameEn: 'Boston Lobster',
    price: 16.99,
    originalPrice: 14.0,
    unit: 'lb',
    origin: 'Boston',
    image: 'https://example.com/lobster1.jpg',
    category: 'lobster',
  },
  {
    id: '5',
    name: '澳洲龙虾',
    nameEn: 'Australian Lobster',
    price: 56.99,
    originalPrice: 42.0,
    unit: 'lb',
    origin: 'Australian',
    image: 'https://example.com/lobster2.jpg',
    category: 'lobster',
  },
  {
    id: '6',
    name: '帝王蟹',
    nameEn: 'King Crab',
    price: 46.99,
    originalPrice: 38.0,
    unit: 'lb',
    origin: 'Norway',
    image: 'https://example.com/crab1.jpg',
    category: 'crab',
  },
  {
    id: '7',
    name: '肉蟹',
    nameEn: 'Dungeness Crab',
    price: 16.99,
    originalPrice: 13.5,
    unit: 'lb',
    origin: 'Vancouver',
    image: 'https://example.com/crab2.jpg',
    category: 'crab',
  },
  {
    id: '8',
    name: '皮皮虾',
    nameEn: 'Mantis Shrimp',
    price: 68.0,
    originalPrice: 45.0,
    unit: 'lb',
    origin: 'Thailand',
    image: 'https://example.com/mantis1.jpg',
    category: 'mantis_shrimp',
  },
  {
    id: '9',
    name: '带壳生蚝(大)',
    nameEn: 'Oyster XL',
    price: 28.0,
    originalPrice: 23.0,
    unit: 'XL',
    origin: 'Oregon',
    image: 'https://example.com/oyster1.jpg',
    category: 'shellfish',
  },
  {
    id: '10',
    name: '东星斑',
    nameEn: 'Coral Grouper',
    price: 56.99,
    originalPrice: 44.0,
    unit: 'lb',
    origin: 'Australian',
    image: 'https://example.com/fish1.jpg',
    category: 'fish',
  },
];
