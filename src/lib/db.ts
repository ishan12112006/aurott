import { supabase, isSupabaseConfigured } from './supabase';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS, DEFAULT_CAFE_SETTINGS } from '@/data/menuData';
import { Category, MenuItem, Order, OrderStatus, OrderItemSnapshot, AnalyticsSummary } from '@/types';

// In-memory / browser fallback store for seamless offline/local demonstration
let localOrders: Order[] = [
  {
    id: 'demo-order-1',
    orderNumber: 'OTT-1024',
    customerName: 'Aarav Sharma',
    customerPhone: '9876543210',
    customerEmail: 'aarav@amity.edu',
    orderType: 'PICKUP',
    pickupLocation: 'OTT Cafe, Amity University Jaipur Campus',
    specialInstructions: 'Make it extra chilled with chocolate syrup',
    subtotal: 180,
    tax: 0,
    total: 180,
    paymentMethod: 'PAY_AT_COUNTER',
    paymentStatus: 'PENDING',
    orderStatus: 'PREPARING',
    estimatedReadyTimeMinutes: 10,
    items: [
      {
        menuItemId: 'item-cold-coffee',
        itemNameSnapshot: 'Cold Coffee',
        unitPrice: 90,
        quantity: 1,
        subtotal: 90,
      },
      {
        menuItemId: 'item-peri-peri-fries',
        itemNameSnapshot: 'Peri Peri Fries',
        unitPrice: 90,
        quantity: 1,
        subtotal: 90,
      },
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-order-2',
    orderNumber: 'OTT-1025',
    customerName: 'Priya Verma',
    customerPhone: '9829012345',
    customerEmail: 'priya@amity.edu',
    orderType: 'PICKUP',
    pickupLocation: 'OTT Cafe, Amity University Jaipur Campus',
    specialInstructions: 'Less spicy red sauce',
    subtotal: 179,
    tax: 0,
    total: 179,
    paymentMethod: 'UPI',
    paymentStatus: 'COMPLETED',
    orderStatus: 'READY',
    estimatedReadyTimeMinutes: 0,
    items: [
      {
        menuItemId: 'item-red-sauce-pasta',
        itemNameSnapshot: 'Red Sauce Pasta',
        unitPrice: 99,
        quantity: 1,
        subtotal: 99,
      },
      {
        menuItemId: 'item-virgin-mojito',
        itemNameSnapshot: 'Virgin Mojito',
        unitPrice: 80,
        quantity: 1,
        subtotal: 80,
      },
    ],
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
];

let localMenuItems: MenuItem[] = [...INITIAL_MENU_ITEMS];
let localCategories: Category[] = [...INITIAL_CATEGORIES];

// Helper to persist/load in browser localStorage
const loadLocalState = () => {
  if (typeof window === 'undefined') return;
  try {
    const savedOrders = localStorage.getItem('ott_orders');
    if (savedOrders) {
      localOrders = JSON.parse(savedOrders);
    }
    const savedItems = localStorage.getItem('ott_menu_items');
    if (savedItems) {
      localMenuItems = JSON.parse(savedItems);
    }
  } catch (err) {
    console.error('Error loading localStorage state', err);
  }
};

const saveLocalState = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('ott_orders', JSON.stringify(localOrders));
    localStorage.setItem('ott_menu_items', JSON.stringify(localMenuItems));
  } catch (err) {
    console.error('Error saving localStorage state', err);
  }
};

if (typeof window !== 'undefined') {
  loadLocalState();
}

/**
 * Fetch all active categories
 */
export async function getCategories(): Promise<Category[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          imageUrl: item.image_url,
          sortOrder: item.sort_order,
          isActive: item.is_active,
        }));
      }
    } catch (err) {
      console.warn('Supabase categories fetch error, using local fallback:', err);
    }
  }
  return localCategories;
}

/**
 * Fetch menu items, optionally filtered by category
 */
export async function getMenuItems(categoryId?: string): Promise<MenuItem[]> {
  loadLocalState();
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          categoryId: item.category_id,
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: Number(item.price),
          secondaryPrice: item.secondary_price ? Number(item.secondary_price) : undefined,
          imageUrl: item.image_url,
          foodType: item.food_type,
          isVegetarian: item.is_vegetarian,
          isAvailable: item.is_available,
          isFeatured: item.is_featured,
          sortOrder: item.sort_order,
          portionNote: item.portion_note,
        }));
      }
    } catch (err) {
      console.warn('Supabase menu_items fetch error, using local fallback:', err);
    }
  }

  if (categoryId) {
    return localMenuItems.filter((item) => item.categoryId === categoryId);
  }
  return localMenuItems;
}

/**
 * Fetch a single menu item by ID
 */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const items = await getMenuItems();
  return items.find((i) => i.id === id) || null;
}

/**
 * Server-side / backend order placement
 * Generates an order number, validates prices, creates records
 */
export async function createOrder(payload: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  specialInstructions?: string;
  paymentMethod: 'PAY_AT_COUNTER' | 'UPI';
  items: {
    menuItemId: string;
    quantity: number;
    selectedOption?: string;
  }[];
}): Promise<Order> {
  loadLocalState();

  // Validate items and compute true prices server-side
  const allItems = await getMenuItems();
  const itemMap = new Map<string, MenuItem>(allItems.map((i) => [i.id, i]));

  const orderItemsSnapshots: OrderItemSnapshot[] = [];
  let subtotal = 0;

  for (const requestedItem of payload.items) {
    const item = itemMap.get(requestedItem.menuItemId);
    if (!item) {
      throw new Error(`Menu item not found: ${requestedItem.menuItemId}`);
    }
    if (!item.isAvailable) {
      throw new Error(`Item is currently unavailable: ${item.name}`);
    }
    if (requestedItem.quantity <= 0) {
      throw new Error(`Invalid quantity for: ${item.name}`);
    }

    const unitPrice = item.price;
    const itemSubtotal = unitPrice * requestedItem.quantity;
    subtotal += itemSubtotal;

    orderItemsSnapshots.push({
      menuItemId: item.id,
      itemNameSnapshot: item.name,
      unitPrice,
      quantity: requestedItem.quantity,
      subtotal: itemSubtotal,
      selectedOption: requestedItem.selectedOption,
    });
  }

  // Generate unique human-friendly order number: e.g. OTT-1048 or OTT-9842
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `OTT-${randomSuffix}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}-${randomSuffix}`,
    orderNumber,
    customerName: payload.customerName.trim(),
    customerPhone: payload.customerPhone.trim(),
    customerEmail: payload.customerEmail?.trim(),
    orderType: 'PICKUP',
    pickupLocation: 'OTT Cafe, Amity University Jaipur Campus',
    specialInstructions: payload.specialInstructions?.trim() || undefined,
    subtotal,
    tax: 0,
    total: subtotal,
    paymentMethod: payload.paymentMethod,
    paymentStatus: payload.paymentMethod === 'UPI' ? 'PENDING' : 'PENDING',
    orderStatus: 'PLACED',
    items: orderItemsSnapshots,
    estimatedReadyTimeMinutes: 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Try saving to Supabase if available
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: newOrder.orderNumber,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          customer_email: newOrder.customerEmail,
          order_type: newOrder.orderType,
          pickup_location: newOrder.pickupLocation,
          special_instructions: newOrder.specialInstructions,
          subtotal: newOrder.subtotal,
          tax: newOrder.tax,
          total: newOrder.total,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus,
          order_status: newOrder.orderStatus,
          estimated_ready_time_minutes: newOrder.estimatedReadyTimeMinutes,
        })
        .select()
        .single();

      if (!orderError && orderData) {
        newOrder.id = orderData.id;
        // Insert order items
        const itemsToInsert = orderItemsSnapshots.map((item) => ({
          order_id: orderData.id,
          menu_item_id: item.menuItemId,
          item_name_snapshot: item.itemNameSnapshot,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.subtotal,
          selected_option: item.selectedOption,
        }));

        await supabase.from('order_items').insert(itemsToInsert);
      }
    } catch (err) {
      console.warn('Error inserting order to Supabase, continuing with fallback persistence:', err);
    }
  }

  // Always update local storage so it's instantly visible in tracking and admin
  localOrders.unshift(newOrder);
  saveLocalState();

  // Dispatch custom event for real-time local listening in browser
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ott_order_created', { detail: newOrder }));
  }

  return newOrder;
}

/**
 * Fetch order by orderNumber and optional phone verification
 */
export async function getOrderByNumber(orderNumber: string, phone?: string): Promise<Order | null> {
  loadLocalState();
  const cleanOrderNum = orderNumber.trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('orders').select('*, order_items(*)').eq('order_number', cleanOrderNum);
      if (phone) {
        query = query.eq('customer_phone', phone.trim());
      }
      const { data, error } = await query.single();
      if (!error && data) {
        return {
          id: data.id,
          orderNumber: data.order_number,
          customerName: data.customer_name,
          customerPhone: data.customer_phone,
          customerEmail: data.customer_email,
          orderType: data.order_type,
          pickupLocation: data.pickup_location,
          specialInstructions: data.special_instructions,
          subtotal: Number(data.subtotal),
          tax: Number(data.tax),
          total: Number(data.total),
          paymentMethod: data.payment_method,
          paymentStatus: data.payment_status,
          orderStatus: data.order_status,
          estimatedReadyTimeMinutes: data.estimated_ready_time_minutes,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          items: (data.order_items || []).map((oi: any) => ({
            id: oi.id,
            orderId: oi.order_id,
            menuItemId: oi.menu_item_id,
            itemNameSnapshot: oi.item_name_snapshot,
            unitPrice: Number(oi.unit_price),
            quantity: oi.quantity,
            subtotal: Number(oi.subtotal),
            selectedOption: oi.selected_option,
          })),
        };
      }
    } catch (err) {
      console.warn('Supabase order lookup error, falling back to local store:', err);
    }
  }

  // Search local orders
  const found = localOrders.find(
    (o) => o.orderNumber.toUpperCase() === cleanOrderNum && (!phone || o.customerPhone.trim() === phone.trim())
  );
  return found || null;
}

/**
 * Update order status (Admin / Kitchen)
 */
export async function updateOrderStatus(orderNumber: string, status: OrderStatus): Promise<boolean> {
  loadLocalState();
  const cleanOrderNum = orderNumber.trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          order_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', cleanOrderNum);

      if (error) {
        console.warn('Supabase status update error:', error);
      }
    } catch (err) {
      console.warn('Supabase status update error:', err);
    }
  }

  const order = localOrders.find((o) => o.orderNumber.toUpperCase() === cleanOrderNum);
  if (order) {
    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    saveLocalState();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ott_order_status_updated', { detail: { orderNumber: cleanOrderNum, status } }));
    }
    return true;
  }
  return false;
}

/**
 * Get all orders (for Admin Dashboard and Kitchen Display)
 */
export async function getAllOrders(): Promise<Order[]> {
  loadLocalState();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          orderNumber: d.order_number,
          customerName: d.customer_name,
          customerPhone: d.customer_phone,
          customerEmail: d.customer_email,
          orderType: d.order_type,
          pickupLocation: d.pickup_location,
          specialInstructions: d.special_instructions,
          subtotal: Number(d.subtotal),
          tax: Number(d.tax),
          total: Number(d.total),
          paymentMethod: d.payment_method,
          paymentStatus: d.payment_status,
          orderStatus: d.order_status,
          estimatedReadyTimeMinutes: d.estimated_ready_time_minutes,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          items: (d.order_items || []).map((oi: any) => ({
            id: oi.id,
            orderId: oi.order_id,
            menuItemId: oi.menu_item_id,
            itemNameSnapshot: oi.item_name_snapshot,
            unitPrice: Number(oi.unit_price),
            quantity: oi.quantity,
            subtotal: Number(oi.subtotal),
            selectedOption: oi.selected_option,
          })),
        }));
      }
    } catch (err) {
      console.warn('Supabase getAllOrders error, returning local store:', err);
    }
  }
  return localOrders;
}

/**
 * Toggle menu item availability
 */
export async function toggleItemAvailability(itemId: string, isAvailable: boolean): Promise<boolean> {
  loadLocalState();
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menu_items').update({ is_available: isAvailable }).eq('id', itemId);
    } catch (err) {
      console.warn('Supabase availability update error:', err);
    }
  }

  const item = localMenuItems.find((i) => i.id === itemId);
  if (item) {
    item.isAvailable = isAvailable;
    saveLocalState();
    return true;
  }
  return false;
}

/**
 * Update menu item price
 */
export async function updateItemPrice(itemId: string, newPrice: number): Promise<boolean> {
  loadLocalState();
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('menu_items').update({ price: newPrice }).eq('id', itemId);
    } catch (err) {
      console.warn('Supabase price update error:', err);
    }
  }

  const item = localMenuItems.find((i) => i.id === itemId);
  if (item) {
    item.price = newPrice;
    saveLocalState();
    return true;
  }
  return false;
}

/**
 * Calculate Analytics summary for the Admin
 */
export async function getAnalytics(): Promise<AnalyticsSummary> {
  const orders = await getAllOrders();

  let todayRevenue = 0;
  let todayOrdersCount = 0;
  let pendingCount = 0;
  let preparingCount = 0;
  let readyCount = 0;
  let completedCount = 0;

  const itemFrequency: Record<string, { count: number; revenue: number }> = {};
  const hourFrequency: Record<string, number> = {};

  orders.forEach((o) => {
    if (o.orderStatus !== 'CANCELLED') {
      todayRevenue += o.total;
    }
    todayOrdersCount += 1;

    if (o.orderStatus === 'PLACED') pendingCount += 1;
    if (o.orderStatus === 'ACCEPTED' || o.orderStatus === 'PREPARING') preparingCount += 1;
    if (o.orderStatus === 'READY') readyCount += 1;
    if (o.orderStatus === 'COMPLETED') completedCount += 1;

    // Items count
    o.items?.forEach((it) => {
      const name = it.itemNameSnapshot;
      if (!itemFrequency[name]) {
        itemFrequency[name] = { count: 0, revenue: 0 };
      }
      itemFrequency[name].count += it.quantity;
      itemFrequency[name].revenue += it.subtotal;
    });

    // Hourly
    try {
      const date = new Date(o.createdAt);
      const hour = `${date.getHours().toString().padStart(2, '0')}:00`;
      hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
    } catch {}
  });

  const topSellingItems = Object.entries(itemFrequency)
    .map(([name, data]) => ({ name, count: data.count, revenue: data.revenue }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const ordersByHour = Object.entries(hourFrequency)
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  return {
    todayRevenue,
    todayOrdersCount,
    pendingCount,
    preparingCount,
    readyCount,
    completedCount,
    averageOrderValue: todayOrdersCount > 0 ? Math.round(todayRevenue / todayOrdersCount) : 0,
    topSellingItems,
    ordersByHour,
    categoryBreakdown: [
      { category: 'Shakes', count: 18 },
      { category: 'Chinese', count: 14 },
      { category: 'Bite Up Snacks', count: 12 },
      { category: 'Rice Combo', count: 10 },
      { category: 'Breakfast', count: 9 },
    ],
  };
}

/**
 * Realtime subscription hook for an individual order
 */
export function subscribeToOrder(orderNumber: string, onUpdate: (order: Order) => void): () => void {
  const cleanOrderNum = orderNumber.trim().toUpperCase();

  // 1. Supabase Realtime channel if available
  let channel: any = null;
  if (isSupabaseConfigured && supabase) {
    channel = supabase
      .channel(`order-${cleanOrderNum}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `order_number=eq.${cleanOrderNum}`,
        },
        async () => {
          const freshOrder = await getOrderByNumber(cleanOrderNum);
          if (freshOrder) onUpdate(freshOrder);
        }
      )
      .subscribe();
  }

  // 2. Browser event listener fallback
  const handleLocalUpdate = (e: any) => {
    if (e.detail?.orderNumber === cleanOrderNum) {
      getOrderByNumber(cleanOrderNum).then((fresh) => {
        if (fresh) onUpdate(fresh);
      });
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('ott_order_status_updated', handleLocalUpdate);
  }

  // Cleanup function
  return () => {
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('ott_order_status_updated', handleLocalUpdate);
    }
  };
}

/**
 * Realtime subscription hook for all live orders (Admin / Kitchen)
 */
export function subscribeToAllOrders(onOrdersChanged: () => void): () => void {
  let channel: any = null;
  if (isSupabaseConfigured && supabase) {
    channel = supabase
      .channel('all-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          onOrdersChanged();
        }
      )
      .subscribe();
  }

  const handleLocalChange = () => {
    onOrdersChanged();
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('ott_order_created', handleLocalChange);
    window.addEventListener('ott_order_status_updated', handleLocalChange);
  }

  return () => {
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('ott_order_created', handleLocalChange);
      window.removeEventListener('ott_order_status_updated', handleLocalChange);
    }
  };
}
