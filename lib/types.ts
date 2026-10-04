// =============================================================
// Lassana LK — TypeScript Type Definitions
// =============================================================

import type { OrderStatus, CustomizationFieldType } from "./constants";

// ─── Database Models ──────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  sku: string | null;
  stock_quantity: number;
  category_id: string | null;
  material_id: string | null;
  color: string | null;
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_customizable: boolean;
  is_active: boolean;
  seo_title: string | null;
  seo_description: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  images?: { id: string; url: string; is_primary: boolean; [key: string]: any }[];
  category?: any;
  material?: any;
}

/** Product with all its relations loaded */
export interface ProductWithDetails extends Product {
  category: Category | null;
  images: ProductImage[];
  videos: ProductVideo[];
  customization_fields: CustomizationFieldWithOptions[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVideo {
  id: string;
  product_id: string;
  url: string;
  title: string | null;
  sort_order: number;
  created_at: string;
}

export interface CustomizationField {
  id: string;
  product_id: string;
  field_name: string;
  field_label: string;
  field_type: CustomizationFieldType;
  is_required: boolean;
  placeholder: string | null;
  max_length: number | null;
  min_value: number | null;
  max_value: number | null;
  sort_order: number;
  created_at: string;
}

export interface CustomizationOption {
  id: string;
  field_id: string;
  label: string;
  value: string;
  price_modifier: number;
  sort_order: number;
}

export interface CustomizationFieldWithOptions extends CustomizationField {
  options: CustomizationOption[];
}

// ─── Order Models ─────────────────────────────────────────────

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string | null;
  customer_email: string | null;
  address: string;
  city: string;
  district: string;
  postal_code: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  payment_method: string;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  items: OrderItemWithCustomizations[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image_url: string | null;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderItemCustomization {
  id: string;
  order_item_id: string;
  field_name: string;
  field_label: string;
  value: string;
}

export interface OrderItemWithCustomizations extends OrderItem {
  customizations: OrderItemCustomization[];
}

// ─── Review Models ────────────────────────────────────────────

export interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string | null;
  image_url: string | null;
  is_approved: boolean;
  is_featured: boolean;
  product_id: string | null;
  created_at: string;
}

// ─── Site Settings ────────────────────────────────────────────

export interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  updated_at: string;
}

// ─── Client-Side State Types ──────────────────────────────────

/** A customization value selected by the customer */
export interface CustomizationValue {
  fieldName: string;
  fieldLabel: string;
  value: string;
}

/** Cart item stored in Zustand */
export interface CartItem {
  /** Unique cart entry ID (product ID + customization hash) */
  cartId: string;
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  isCustomizable: boolean;
  customizations: CustomizationValue[];
}

/** Wishlist item stored in Zustand */
export interface WishlistItem {
  productId: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  price: number;
  addedAt: string;
}

// ─── API Request/Response Types ───────────────────────────────

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string;
  customerEmail?: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  notes?: string;
  codConfirmed: boolean;
}

export interface CreateOrderPayload {
  customer: CheckoutFormData;
  items: {
    productId: string;
    quantity: number;
    customizations: CustomizationValue[];
  }[];
}

export interface CreateOrderResponse {
  success: boolean;
  orderNumber: string;
  orderId: string;
}

// ─── Filter/Sort Types ────────────────────────────────────────

export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  material?: string;
  isCustomizable?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock?: boolean;
  search?: string;
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-selling";

// ─── Admin Dashboard Types ────────────────────────────────────

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}
