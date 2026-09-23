-- OTT Cafe (Amity University Jaipur) Database Schema
-- Run this in the Supabase SQL Editor to set up tables, RLS, and Realtime

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Admin & Staff Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  secondary_price NUMERIC(10, 2),
  image_url TEXT,
  food_type TEXT DEFAULT 'veg' CHECK (food_type IN ('veg', 'egg', 'non-veg')),
  is_vegetarian BOOLEAN DEFAULT TRUE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,
  sort_order INT DEFAULT 0 NOT NULL,
  portion_note TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  order_type TEXT NOT NULL DEFAULT 'PICKUP',
  pickup_location TEXT NOT NULL DEFAULT 'OTT Cafe, Amity University Jaipur Campus',
  special_instructions TEXT,
  subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
  tax NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL DEFAULT 'PAY_AT_COUNTER' CHECK (payment_method IN ('PAY_AT_COUNTER', 'UPI')),
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED')),
  order_status TEXT NOT NULL DEFAULT 'PLACED' CHECK (order_status IN ('PLACED', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED')),
  estimated_ready_time_minutes INT DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ORDER ITEMS (Snapshot)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id TEXT NOT NULL,
  item_name_snapshot TEXT NOT NULL,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(10, 2) NOT NULL,
  selected_option TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. CAFE SETTINGS
CREATE TABLE IF NOT EXISTS public.cafe_settings (
  id INT PRIMARY KEY DEFAULT 1,
  cafe_name TEXT NOT NULL DEFAULT 'OTT Cafe',
  tagline TEXT DEFAULT 'Good Food. Good Vibes. Campus Life.',
  campus TEXT DEFAULT 'Amity University Jaipur',
  location_address TEXT DEFAULT 'Amity University Jaipur Campus, Kant Kalwar, NH-11C, Jaipur, Rajasthan 303002',
  phone TEXT DEFAULT '+91 98765 43210',
  email TEXT DEFAULT 'ottcafe.amity@gmail.com',
  instagram TEXT DEFAULT '@ottcafe.amity',
  opening_hours TEXT DEFAULT '9:00 AM – 10:00 PM (Mon – Sun)',
  upi_id TEXT DEFAULT 'ottcafe@upi',
  pickup_instructions TEXT DEFAULT 'Pick up your order fresh and hot at the OTT Cafe counter inside campus.',
  is_accepting_orders BOOLEAN DEFAULT TRUE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_menu_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_settings ENABLE ROW LEVEL SECURITY;

-- HELPER FUNCTIONS FOR RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS POLICIES

-- Profiles: Users can read own profile; Admin can read all
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

-- Categories: Public read; Admin write
CREATE POLICY "Anyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = TRUE OR public.is_admin());
CREATE POLICY "Admin can modify categories" ON public.categories
  FOR ALL USING (public.is_admin());

-- Menu Items: Public read; Admin write
CREATE POLICY "Anyone can view menu items" ON public.menu_items
  FOR SELECT USING (TRUE);
CREATE POLICY "Admin can modify menu items" ON public.menu_items
  FOR ALL USING (public.is_admin());

-- Orders: Public can create orders; anyone can look up by order number + phone; Admin can do all
CREATE POLICY "Public can insert orders" ON public.orders
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Customers can view their orders" ON public.orders
  FOR SELECT USING (TRUE);
CREATE POLICY "Admin can update orders" ON public.orders
  FOR UPDATE USING (public.is_admin());

-- Order Items: Public can insert items; anyone can read snapshots for their order; Admin can do all
CREATE POLICY "Public can insert order items" ON public.order_items
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Anyone can view order items" ON public.order_items
  FOR SELECT USING (TRUE);
CREATE POLICY "Admin can update order items" ON public.order_items
  FOR ALL USING (public.is_admin());

-- Cafe Settings: Public read; Admin write
CREATE POLICY "Public can view cafe settings" ON public.cafe_settings
  FOR SELECT USING (TRUE);
CREATE POLICY "Admin can update cafe settings" ON public.cafe_settings
  FOR ALL USING (public.is_admin());

-- ENABLE SUPABASE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
