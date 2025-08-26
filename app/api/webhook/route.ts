import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.SBTC_WEBHOOK_SECRET || '47684ea26346c3f77d6422b53af0160d2278597827bc1ed9c507e979c34b8f95';

const processedEvents = new Map<string, boolean>();

function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  tolerance = 300
): boolean {
  const elements = signature.split(',');
  const timestamp = elements.find(el => el.startsWith('t='))?.split('=')[1];
  const v1 = elements.find(el => el.startsWith('v1='))?.split('=')[1];

  if (!timestamp || !v1) {
    return false;
  }

  const timestampNum = parseInt(timestamp);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNum) > tolerance) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(v1, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch {
    return false;
  }
}

async function handlePaymentIntentCreated(paymentIntent: any) {
  console.log('New payment intent created:', paymentIntent.id);
  console.log('Amount:', paymentIntent.amount);
  console.log('Customer:', paymentIntent.customer_email);
  console.log('Metadata:', paymentIntent.metadata);
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('Payment succeeded:', paymentIntent.id);
  console.log('Transaction ID:', paymentIntent.tx_id);
  console.log('Receipt URL:', paymentIntent.receipt_url);
  console.log('Order ID:', paymentIntent.metadata?.order_id);
  
  if (paymentIntent.customer_email) {
    console.log('Should send confirmation email to:', paymentIntent.customer_email);
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('Payment failed:', paymentIntent.id);
  console.log('Failure reason:', paymentIntent.metadata?.failure_reason);
  
  if (paymentIntent.customer_email) {
    console.log('Should notify customer:', paymentIntent.customer_email);
  }
}

async function handlePaymentIntentCanceled(paymentIntent: any) {
  console.log('Payment canceled:', paymentIntent.id);
  console.log('Order ID:', paymentIntent.metadata?.order_id);
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-sbtc-signature');
  const eventType = request.headers.get('x-sbtc-event-type');
  const eventId = request.headers.get('x-sbtc-event-id');

  if (!signature || !eventType || !eventId) {
    return NextResponse.json(
      { error: 'Missing required headers' },
      { status: 400 }
    );
  }

  if (processedEvents.has(eventId)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    const rawBody = await request.text();

    if (!verifyWebhookSignature(rawBody, signature, WEBHOOK_SECRET)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    switch (event.type) {
      case 'payment_intent.created':
        await handlePaymentIntentCreated(event.data.object);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object);
        break;
      default:
        console.log('Unhandled event type:', event.type);
    }

    processedEvents.set(eventId, true);

    if (processedEvents.size > 10000) {
      const firstKey = processedEvents.keys().next().value;
      if (firstKey) {
        processedEvents.delete(firstKey);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}