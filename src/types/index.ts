export type FoodType = 'veg' | 'egg' | 'non-veg';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  secondaryPrice?: number; // e.g. for Tea (20/30)
  imageUrl: string;
  foodType: FoodType;
  isVegetarian: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  portionNote?: string; // e.g. "8 pcs", "6 pcs"
  options?: string[]; // e.g. ["Dry", "Gravy"] for Manchurian
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOption?: string;
  selectedPrice: number;
}

export type OrderStatus = 'PLACED' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export type PaymentMethod = 'PAY_AT_COUNTER' | 'UPI';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface OrderItemSnapshot {
  id?: string;
  orderId?: string;
  menuItemId: string;
  itemNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  selectedOption?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. OTT-1024
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  orderType: 'PICKUP';
  pickupLocation: string;
  specialInstructions?: string;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItemSnapshot[];
  createdAt: string;
  updatedAt: string;
  estimatedReadyTimeMinutes?: number;
}

export interface CafeSettings {
  cafeName: string;
  tagline: string;
  campus: string;
  locationAddress: string;
  phone: string;
  email: string;
  instagram: string;
  openingHours: string;
  upiId: string;
  pickupInstructions: string;
  isAcceptingOrders: boolean;
}

export interface AnalyticsSummary {
  todayRevenue: number;
  todayOrdersCount: number;
  pendingCount: number;
  preparingCount: number;
  readyCount: number;
  completedCount: number;
  averageOrderValue: number;
  topSellingItems: { name: string; count: number; revenue: number }[];
  ordersByHour: { hour: string; count: number }[];
  categoryBreakdown: { category: string; count: number }[];
}
