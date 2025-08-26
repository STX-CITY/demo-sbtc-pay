#!/usr/bin/env node

const crypto = require('crypto');

const WEBHOOK_SECRET = 'your-webhook-secret';

function generateSignature(payload, secret) {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  return `t=${timestamp},v1=${signature}`;
}

const testPayload = {
  id: 'evt_test_' + Date.now(),
  type: 'payment_intent.succeeded',
  data: {
    object: {
      id: 'pi_test_' + Date.now(),
      object: 'payment_intent',
      amount: 100000,
      amount_usd: 65.50,
      currency: 'sbtc',
      status: 'succeeded',
      customer_address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      customer_email: 'customer@example.com',
      description: 'Purchase of Product XYZ',
      metadata: {
        order_id: 'ORD-12345',
        customer_id: 'CUST-67890'
      },
      tx_id: '0x123abc456def789',
      receipt_url: 'https://explorer.stacks.co/txid/0x123abc456def789',
      created: Date.now(),
      livemode: false
    }
  },
  created: Date.now()
};

const payloadString = JSON.stringify(testPayload);
const signature = generateSignature(payloadString, WEBHOOK_SECRET);

console.log('Testing webhook endpoint...\n');
console.log('Event ID:', testPayload.id);
console.log('Event Type:', testPayload.type);
console.log('Signature:', signature);
console.log('\nPayload:', JSON.stringify(testPayload, null, 2));

fetch('http://localhost:3000/api/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-SBTC-Signature': signature,
    'X-SBTC-Event-Type': testPayload.type,
    'X-SBTC-Event-Id': testPayload.id,
    'User-Agent': 'SBTC-Webhooks/1.0'
  },
  body: payloadString
})
.then(response => response.json())
.then(data => {
  console.log('\nResponse:', data);
  console.log('✓ Webhook test completed successfully');
})
.catch(error => {
  console.error('\n✗ Error:', error);
});

console.log('\nTesting different event types...\n');

const eventTypes = [
  'payment_intent.created',
  'payment_intent.succeeded',
  'payment_intent.failed',
  'payment_intent.canceled'
];

eventTypes.forEach(async (eventType, index) => {
  setTimeout(() => {
    const payload = {
      ...testPayload,
      id: `evt_test_${eventType}_${Date.now()}`,
      type: eventType,
      data: {
        object: {
          ...testPayload.data.object,
          id: `pi_test_${eventType}_${Date.now()}`,
          status: eventType.split('.')[1],
          metadata: {
            ...testPayload.data.object.metadata,
            ...(eventType === 'payment_intent.failed' ? { failure_reason: 'Insufficient funds' } : {})
          }
        }
      }
    };

    const payloadStr = JSON.stringify(payload);
    const sig = generateSignature(payloadStr, WEBHOOK_SECRET);

    fetch('http://localhost:3000/api/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-SBTC-Signature': sig,
        'X-SBTC-Event-Type': eventType,
        'X-SBTC-Event-Id': payload.id,
        'User-Agent': 'SBTC-Webhooks/1.0'
      },
      body: payloadStr
    })
    .then(response => response.json())
    .then(data => {
      console.log(`✓ ${eventType}:`, data);
    })
    .catch(error => {
      console.error(`✗ ${eventType}:`, error);
    });
  }, index * 500);
});