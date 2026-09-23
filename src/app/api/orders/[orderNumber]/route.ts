import { NextRequest, NextResponse } from 'next/server';
import { getOrderByNumber, updateOrderStatus } from '@/lib/db';
import { OrderStatus } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
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

    const success = await updateOrderStatus(orderNumber, status as OrderStatus);

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
