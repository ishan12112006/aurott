import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getOrderByNumber, updateOrderStatus } from '@/lib/db';
import { OrderStatus } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const configuredAdminKey = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    const providedAdminKey = request.headers.get('x-admin-key');
    if (!configuredAdminKey || providedAdminKey !== configuredAdminKey) {
      return NextResponse.json(
        { success: false, message: 'Admin authentication required.' },
        { status: 401 }
      );
    }

    const { orderNumber } = await params;
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone') || undefined;

    const order = await getOrderByNumber(orderNumber, phone);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order could not be found. Please check your order number or phone.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses: OrderStatus[] = [
      'PLACED',
      'ACCEPTED',
      'PREPARING',
      'READY',
      'COMPLETED',
      'CANCELLED',
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid order status specified.' },
        { status: 400 }
      );
    }

    let success = false;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (serviceRoleKey && supabaseUrl) {
      const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data, error } = await adminSupabase
        .from('orders')
        .update({
          order_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('order_number', orderNumber.trim().toUpperCase())
        .select('id')
        .maybeSingle();
      success = !error && Boolean(data);
      if (error) console.error('Service-role order update failed:', error);
    } else {
      success = await updateOrderStatus(orderNumber, status as OrderStatus);
    }

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Failed to update order status. Order not found.' },
        { status: 404 }
      );
    }

    const updated = await getOrderByNumber(orderNumber);

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating order status' },
      { status: 500 }
    );
  }
}
