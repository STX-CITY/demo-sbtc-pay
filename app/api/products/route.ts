import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = `${process.env.SBTC_PAY_API_URL}/api/v1/products`;
    console.log('Fetching products from:', url);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SBTC_PAY_API_KEY}`,
      },
      cache: 'no-store',
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ products: data.data || [] });
    } else {
      console.error('Failed to fetch products:', response.status, response.statusText);
      return NextResponse.json({ products: [] }, { status: response.status });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ products: [], error: 'Failed to fetch products' }, { status: 500 });
  }
}