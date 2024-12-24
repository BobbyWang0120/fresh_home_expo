import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

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

// CSV数据转换为TypeScript对象
export const products: Product[] = [
  {
    id: '1',
    nameEn: 'Greasyback Shrimp',
    name: '基围虾',
    origin: 'Florida',
    category: 'shrimp',
    unit: 'lb',
    originalPrice: 20.0,
    price: 26.99,
    image: 'https://example.com/products/shrimp1.jpg',
  },
  {
    id: '2',
    nameEn: 'Ridgeback Shrimp',
    name: '竹节虾',
    origin: 'California',
    category: 'shrimp',
    unit: 'lb',
    originalPrice: 7.5,
    price: 7.99,
    image: 'https://example.com/products/shrimp2.jpg',
  },
  {
    id: '3',
    nameEn: 'Spot Prawn Shrimp',
    name: '珊瑚虾',
    origin: 'California',
    category: 'shrimp',
    unit: 'lb',
    originalPrice: 35.0,
    price: 48.0,
    image: 'https://example.com/products/shrimp3.jpg',
  },
  {
    id: '4',
    nameEn: 'Dublin Bay Prawn',
    name: '螯虾',
    origin: 'Norway',
    category: 'shrimp',
    unit: 'lb',
    originalPrice: 48.0,
    price: 58.0,
    image: 'https://example.com/products/shrimp4.jpg',
  },
  {
    id: '5',
    nameEn: 'Lobster',
    name: '龙虾 波士顿',
    origin: 'Boston',
    category: 'lobster',
    unit: '3~4 lb',
    originalPrice: 14.0,
    price: 16.99,
    image: 'https://example.com/products/lobster1.jpg',
  },
  {
    id: '6',
    nameEn: 'Lobster',
    name: '龙虾 波士顿',
    origin: 'Boston',
    category: 'lobster',
    unit: '1.5 lb',
    originalPrice: 13.0,
    price: 15.99,
    image: 'https://example.com/products/lobster2.jpg',
  },
  {
    id: '7',
    nameEn: 'Australian Lobster',
    name: '龙虾 澳洲',
    origin: 'Australian',
    category: 'lobster',
    unit: 'lb',
    originalPrice: 42.0,
    price: 56.99,
    image: 'https://example.com/products/lobster3.jpg',
  },
  {
    id: '8',
    nameEn: 'California Lobster',
    name: '龙虾 加州',
    origin: 'California',
    category: 'lobster',
    unit: 'lb',
    originalPrice: 29.0,
    price: 34.99,
    image: 'https://example.com/products/lobster4.jpg',
  },
  {
    id: '9',
    nameEn: 'Dungeness Crab',
    name: '肉蟹',
    origin: 'Vancouver',
    category: 'crab',
    unit: 'lb',
    originalPrice: 13.5,
    price: 16.99,
    image: 'https://example.com/products/crab1.jpg',
  },
  {
    id: '10',
    nameEn: 'Blue Crab',
    name: '蓝蟹',
    origin: 'Louisiana',
    category: 'crab',
    unit: 'lb',
    originalPrice: 5.5,
    price: 7.0,
    image: 'https://example.com/products/crab2.jpg',
  },
  {
    id: '11',
    nameEn: 'Brown Crab',
    name: '面包蟹',
    origin: 'U.K.',
    category: 'crab',
    unit: 'lb',
    originalPrice: 13.0,
    price: 17.99,
    image: 'https://example.com/products/crab3.jpg',
  },
  {
    id: '12',
    nameEn: 'King Crab',
    name: '帝王蟹',
    origin: 'Norway',
    category: 'crab',
    unit: 'lb',
    originalPrice: 38.0,
    price: 46.99,
    image: 'https://example.com/products/crab4.jpg',
  },
  {
    id: '13',
    nameEn: 'Scylla Serrata Crab',
    name: '膏蟹',
    origin: 'Vietnam',
    category: 'crab',
    unit: 'lb',
    originalPrice: 22.0,
    price: 28.99,
    image: 'https://example.com/products/crab5.jpg',
  },
  {
    id: '14',
    nameEn: 'Mantis Shrimp',
    name: '皮皮虾',
    origin: 'Thailand',
    category: 'mantis_shrimp',
    unit: 'lb',
    originalPrice: 45.0,
    price: 68.0,
    image: 'https://example.com/products/mantis1.jpg',
  },
  {
    id: '15',
    nameEn: 'Zebra Mantis Shrimp',
    name: '斑马皮皮虾',
    origin: 'Philippines',
    category: 'mantis_shrimp',
    unit: 'lb',
    originalPrice: 48.0,
    price: 72.0,
    image: 'https://example.com/products/mantis2.jpg',
  },
  {
    id: '16',
    nameEn: 'Oyster',
    name: '带壳生蚝 大',
    origin: 'Oregon',
    category: 'shellfish',
    unit: 'XL',
    originalPrice: 23.0,
    price: 28.0,
    image: 'https://example.com/products/shellfish1.jpg',
  },
  {
    id: '17',
    nameEn: 'Oyster',
    name: '带壳生蚝 中',
    origin: 'Oregon',
    category: 'shellfish',
    unit: 'M',
    originalPrice: 20.0,
    price: 25.0,
    image: 'https://example.com/products/shellfish2.jpg',
  },
  {
    id: '18',
    nameEn: 'Oyster',
    name: '带壳生蚝 小',
    origin: 'Oregon',
    category: 'shellfish',
    unit: 'S',
    originalPrice: 10.0,
    price: 18.0,
    image: 'https://example.com/products/shellfish3.jpg',
  },
  {
    id: '19',
    nameEn: 'Abalone',
    name: '鲍鱼',
    origin: 'Mexican',
    category: 'shellfish',
    unit: 'Pcs',
    originalPrice: 6.0,
    price: 8.0,
    image: 'https://example.com/products/shellfish4.jpg',
  },
  {
    id: '20',
    nameEn: 'Scallop',
    name: '扇贝',
    origin: 'Boston',
    category: 'shellfish',
    unit: 'lb',
    originalPrice: 8.0,
    price: 9.99,
    image: 'https://example.com/products/shellfish5.jpg',
  },
  {
    id: '21',
    nameEn: 'Surf Clam',
    name: '贵妃蚌',
    origin: 'Boston',
    category: 'shellfish',
    unit: 'lb',
    originalPrice: 4.5,
    price: 5.99,
    image: 'https://example.com/products/shellfish6.jpg',
  },
  {
    id: '22',
    nameEn: 'Conch',
    name: '响螺',
    origin: 'Boston',
    category: 'shellfish',
    unit: 'lb',
    originalPrice: 7.0,
    price: 7.99,
    image: 'https://example.com/products/shellfish7.jpg',
  },
  {
    id: '23',
    nameEn: 'Pond Snails',
    name: '石螺',
    origin: 'Boston',
    category: 'shellfish',
    unit: 'lb',
    originalPrice: 5.0,
    price: 6.99,
    image: 'https://example.com/products/shellfish8.jpg',
  },
  {
    id: '24',
    nameEn: 'Babylonia lutosa',
    name: '花螺',
    origin: 'Vietnam',
    category: 'shellfish',
    unit: 'lb',
    originalPrice: 17.0,
    price: 23.0,
    image: 'https://example.com/products/shellfish9.jpg',
  },
  {
    id: '25',
    nameEn: 'Black Rockfish',
    name: '黑石斑',
    origin: 'South Korea',
    category: 'fish',
    unit: 'lb',
    originalPrice: 22.0,
    price: 26.99,
    image: 'https://example.com/products/fish1.jpg',
  },
  {
    id: '26',
    nameEn: 'Turbot',
    name: '多宝鱼',
    origin: 'South Korea',
    category: 'fish',
    unit: 'lb',
    originalPrice: 22.0,
    price: 26.99,
    image: 'https://example.com/products/fish2.jpg',
  },
  {
    id: '27',
    nameEn: 'Tiger Grouper',
    name: '老虎斑',
    origin: 'Taiwan',
    category: 'fish',
    unit: 'lb',
    originalPrice: 25.0,
    price: 36.99,
    image: 'https://example.com/products/fish3.jpg',
  },
  {
    id: '28',
    nameEn: 'Coral Grouper',
    name: '东星斑',
    origin: 'Australian',
    category: 'fish',
    unit: 'lb',
    originalPrice: 44.0,
    price: 56.99,
    image: 'https://example.com/products/fish4.jpg',
  },
  {
    id: '29',
    nameEn: 'Gopher rockfish',
    name: '麻斑',
    origin: 'California',
    category: 'fish',
    unit: 'lb',
    originalPrice: 17.0,
    price: 18.99,
    image: 'https://example.com/products/fish5.jpg',
  },
  {
    id: '30',
    nameEn: 'Bolina rockfish',
    name: '粉斑',
    origin: 'California',
    category: 'fish',
    unit: 'lb',
    originalPrice: 18.0,
    price: 19.99,
    image: 'https://example.com/products/fish6.jpg',
  },
  {
    id: '31',
    nameEn: 'Lingcod',
    name: '花鳕',
    origin: 'California',
    category: 'fish',
    unit: 'lb',
    originalPrice: 8.0,
    price: 10.0,
    image: 'https://example.com/products/fish7.jpg',
  },
  {
    id: '32',
    nameEn: 'Cabezone',
    name: '沉龙',
    origin: 'California',
    category: 'fish',
    unit: 'lb',
    originalPrice: 16.5,
    price: 19.99,
    image: 'https://example.com/products/fish8.jpg',
  },
  {
    id: '33',
    nameEn: 'Red Grouper',
    name: '大眼红斑',
    origin: 'California',
    category: 'fish',
    unit: 'lb',
    originalPrice: 28.0,
    price: 33.99,
    image: 'https://example.com/products/fish9.jpg',
  },
  {
    id: '34',
    nameEn: 'Black cod',
    name: '黑鳕鱼',
    origin: 'California',
    category: 'fish',
    unit: 'lb',
    originalPrice: 6.0,
    price: 9.99,
    image: 'https://example.com/products/fish10.jpg',
  },
];