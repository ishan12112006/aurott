import { NextRequest, NextResponse } from 'next/server';
import { getCategories, getMenuItems, toggleItemAvailability, updateItemPrice } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId') || undefined;

    const [categories, items] = await Promise.all([
      getCategories(),
      getMenuItems(categoryId),
    ]);

    return NextResponse.json({
      success: true,
      categories,
      items,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching menu data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, isAvailable, price } = body;

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required.' },
        { status: 400 }
      );
    }

    if (typeof isAvailable === 'boolean') {
      await toggleItemAvailability(itemId, isAvailable);
    }

    if (typeof price === 'number') {
      if (price < 0) {
        return NextResponse.json(
          { success: false, message: 'Price cannot be negative.' },
          { status: 400 }
        );
      }
      await updateItemPrice(itemId, price);
    }

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error updating item' },
      { status: 500 }
    );
  }
}
