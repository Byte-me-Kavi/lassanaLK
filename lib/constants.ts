// =============================================================
// Lassana LK — Application Constants
// =============================================================

/**
 * Site-wide configuration.
 * All brand/config values centralized here for easy modification.
 */
export const SITE_CONFIG = {
  name: "Lassana LK",
  tagline: "Beautiful jewelry, made personal.",
  description:
    "Discover elegant jewelry and personalized name pendants from Lassana LK. Shop beautiful designs with convenient Cash on Delivery ordering in Sri Lanka.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94774671009",
  currency: "LKR",
  currencySymbol: "Rs.",
  defaultDeliveryFee: 350,
  freeDeliveryThreshold: 10000,
} as const;

/**
 * Order statuses with labels and color mappings.
 * Colors reference CSS custom property names for easy theming.
 */
export const ORDER_STATUSES = {
  PENDING: { label: "Pending", color: "amber" },
  CONFIRMED: { label: "Confirmed", color: "blue" },
  PROCESSING: { label: "Processing", color: "indigo" },
  READY_TO_SHIP: { label: "Ready to Ship", color: "purple" },
  SHIPPED: { label: "Shipped", color: "cyan" },
  DELIVERED: { label: "Delivered", color: "emerald" },
  CANCELLED: { label: "Cancelled", color: "red" },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUSES;

/**
 * Product customization field types.
 */
export const CUSTOMIZATION_FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "textarea", label: "Text Area" },
  { value: "select", label: "Dropdown Select" },
  { value: "radio", label: "Radio Buttons" },
  { value: "checkbox", label: "Checkbox" },
  { value: "number", label: "Number Input" },
] as const;

export type CustomizationFieldType =
  (typeof CUSTOMIZATION_FIELD_TYPES)[number]["value"];

/**
 * Sri Lankan districts for checkout.
 */
export const SRI_LANKAN_DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
] as const;

/**
 * Navigation links for storefront header.
 */
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop/collections", label: "Collections" },
  { href: "/shop/personalized-jewelry", label: "Customize" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Footer link groups.
 */
export const FOOTER_LINKS = {
  shop: [
    { href: "/", label: "All Products" },
    { href: "/shop/new-arrivals", label: "New Arrivals" },
    { href: "/shop/personalized-jewelry", label: "Personalized Jewelry" },
    { href: "/shop/collections", label: "Collections" },
  ],
  help: [
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/delivery", label: "Delivery Information" },
    { href: "/terms", label: "Returns" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/reviews", label: "Reviews" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
} as const;

/**
 * Social media links.
 */
export const SOCIAL_LINKS = {
  instagram: "#",
  facebook: "#",
  tiktok: "#",
  whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94774671009"}`,
} as const;

/**
 * Admin sidebar navigation.
 */
export const ADMIN_NAV_LINKS = [
  { href: "/portal", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/portal/products", label: "Products", icon: "Package" },
  { href: "/portal/orders", label: "Orders", icon: "ShoppingBag" },
  { href: "/portal/categories", label: "Categories", icon: "FolderTree" },
  { href: "/portal/reviews", label: "Reviews", icon: "MessageSquare" },
  { href: "/portal/settings", label: "Settings", icon: "Settings" },
] as const;

/**
 * Product sort options for the shop page.
 */
export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "best-selling", label: "Best Selling" },
] as const;

/**
 * Max upload sizes.
 */
export const UPLOAD_LIMITS = {
  imageMaxSize: 5 * 1024 * 1024, // 5MB
  videoMaxSize: 50 * 1024 * 1024, // 50MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  allowedVideoTypes: ["video/mp4", "video/webm"],
  maxImagesPerProduct: 10,
} as const;

