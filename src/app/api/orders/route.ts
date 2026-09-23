import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getAllOrders } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerEmail, specialInstructions, paymentMethod, items } = body;

    // 1. Validation
    if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid full name (at least 2 characters).' },
        { status: 400 }
      );
    }

    const cleanPhone = (customerPhone || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid 10-digit phone number.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your cart cannot be empty when placing an order.' },
        { status: 400 }
      );
    }

    // 2. Prevent negative quantities
    for (const item of items) {
      if (!item.menuItemId || !item.quantity || item.quantity <= 0) {
        return NextResponse.json(
          { success: false, message: 'Invalid item or quantity submitted in cart.' },
          { status: 400 }
        );
      }
    }

    // 3. Server-side price calculation and order insertion
    const createdOrder = await createOrder({
      customerName,
      customerPhone: cleanPhone,
      customerEmail,
      specialInstructions,
      paymentMethod: paymentMethod === 'UPI' ? 'UPI' : 'PAY_AT_COUNTER',
      items,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully!',
        order: createdOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API /api/orders error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Something went wrong while placing your order. Please try again.',
      },
      { status: 500 }
    );
  }
}
