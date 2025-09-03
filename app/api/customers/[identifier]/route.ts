import { NextRequest, NextResponse } from 'next/server';

const SBTC_PAY_API_URL = process.env.SBTC_PAY_API_URL || 'http://localhost:3000';
const SBTC_PAY_API_KEY = process.env.SBTC_PAY_API_KEY;


export const revalidate = 0;
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    
    if (!identifier) {
      return NextResponse.json(
        { error: 'Customer identifier is required' },
        { status: 400 }
      );
    }

    // Call sBTC Pay customer API
    const response = await fetch(`${SBTC_PAY_API_URL}/api/v1/customers/${encodeURIComponent(identifier)}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SBTC_PAY_API_KEY}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Customer not found' },
          { status: 404 }
        );
      }
      throw new Error(`API responded with status ${response.status}`);
    }

    const customerData = await response.json();
    
    return NextResponse.json(customerData);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}