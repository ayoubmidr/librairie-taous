// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'reseller' | 'wholesaler' | 'admin';
  reseller_status: 'pending' | 'approved' | 'rejected' | null;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  children?: Pick<Category, 'id' | 'name' | 'slug'>[];
}

// ─── Author ───────────────────────────────────────────────────────────────────
export interface Author {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  photo_url?: string;
}

// ─── Publisher ────────────────────────────────────────────────────────────────
export interface Publisher {
  id: number;
  name: string;
  slug: string;
  logo_url?: string;
  is_our_editions: boolean;
}

// ─── Product ──────────────────────────────────────────────────────────────────
export interface BulkDiscount {
  min_quantity: number;
  discount_percent: number;
  is_active: boolean;
}

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  isbn?: string;
  short_description?: string;
  description?: string;
  price: string | number;
  compare_price?: string | number;
  discount_percent?: number;
  reseller_price?: string | number;
  wholesaler_price?: string | number;
  stock: number;
  type: 'simple' | 'preorder' | 'pack';
  preorder_date?: string;
  preorder_message?: string;
  language: string;
  format?: string;
  pages?: number;
  weight?: number;
  is_new: boolean;
  is_bestseller: boolean;
  is_on_sale: boolean;
  is_featured: boolean;
  is_out_of_stock: boolean;
  is_low_stock: boolean;
  is_digital: boolean;
  bulk_discount_enabled: boolean;
  main_image_url: string;
  images?: ProductImage[];
  category?: Pick<Category, 'id' | 'name' | 'slug'>;
  publisher?: Pick<Publisher, 'id' | 'name' | 'slug'>;
  authors?: Pick<Author, 'id' | 'name'>[];
  bulk_discounts?: BulkDiscount[];
  average_rating: number;
  reviews_count: number;
  in_wishlist?: boolean;
  meta_title?: string;
  meta_description?: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  product_id: number;
  product_name: string;
  product_slug: string;
  image?: string;
  price: string | number;
  quantity: number;
  is_preorder: boolean;
  preorder_date?: string;
  authors?: string;
  bulk_discount?: number;
}

export interface CartSummary {
  subtotal: string | number;
  coupon_discount: string | number;
  coupon?: string;
  shipping: string | number;
  total: string | number;
}

// ─── Order ────────────────────────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: number;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
  is_preorder: boolean;
  product_slug?: string;
  product_image?: string;
}

export interface Order {
  id: number;
  order_number: string;
  first_name: string;
  last_name: string;
  email: string;
  status: OrderStatus;
  status_label?: string;
  payment_status: PaymentStatus;
  shipping_address?: Record<string, string>;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  tracking_number?: string;
  tracking_url?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  has_preorder: boolean;
  items?: OrderItem[];
  items_count?: number;
}

// ─── Address ──────────────────────────────────────────────────────────────────
export interface Address {
  id?: number;
  label?: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  state?: string;
  country: string;
  phone?: string;
  is_default?: boolean;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  id: number;
  author_name: string;
  rating: number;
  title?: string;
  content?: string;
  is_verified_purchase: boolean;
  created_at: string;
}

// ─── Inertia Page Props ───────────────────────────────────────────────────────
export interface PageProps {
  auth: { user: AuthUser | null };
  cart: CartItem[];
  cartCount: number;
  categories: Category[];
  flash: { success?: string; error?: string };
  [key: string]: unknown;
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  from: number;
  to: number;
}

// ─── Shipping ─────────────────────────────────────────────────────────────────
export interface ShippingRate {
  id: number;
  name: string;
  rate: string | number;
  description?: string;
  estimated_days_min?: number;
  estimated_days_max?: number;
}

// ─── Banner ───────────────────────────────────────────────────────────────────
export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  button_text?: string;
  button_link?: string;
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
export interface Faq {
  id: number;
  question: string;
  answer: string;
  category?: string;
}
