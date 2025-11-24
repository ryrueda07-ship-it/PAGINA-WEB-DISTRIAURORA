export interface Product {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  price: number; // Precio Detal
  wholesalePrice: number; // Precio por Mayor
}

export interface CartItem extends Product {
  quantity: number;
  selectedPriceType: 'retail' | 'wholesale'; // New field to track user choice
}

export interface Order {
  id: string; // Invoice Number
  date: string;
  items: CartItem[];
  total: number;
}

export interface Customer {
  id: string; // Phone number or Email as ID
  name: string;
  email: string;
  phone: string;
  address: string;
  documentId: string; // NIT or CC
  orders: Order[];
  firstPurchaseDate: string;
  lastPurchaseDate: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum SectionId {
  HOME = 'inicio',
  ABOUT = 'nosotros',
  PRODUCTS = 'productos',
  CONTACT = 'contacto',
}