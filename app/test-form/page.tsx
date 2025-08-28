'use client';

import { useEffect } from 'react';

interface PaymentIntent {
  id: string;
  amount: number;
  [key: string]: unknown;
}

interface SBTCPayWindow extends Window {
  SBTCPay?: {
    createCheckout: (config: {
      containerId: string;
      productId: string;
      apiKey: string;
      style: {
        width: string;
        height: string;
        borderRadius: string;
        primaryColor: string;
        theme: string;
      };
      onSuccess: (paymentIntent: PaymentIntent) => void;
      onError: (error: Error) => void;
      onCancel: () => void;
    }) => void;
  };
}

export default function TestFormPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sbtcpay.org/embed/checkout.js';
    script.onload = function() {
      (window as SBTCPayWindow).SBTCPay?.createCheckout({
        containerId: 'sbtc-checkout-prod_tvXG_9G50M6ycAJf',
        productId: 'prod_tvXG_9G50M6ycAJf',
        apiKey: 'pk_test_bKtnwPcfUSvyFyr28CVaMmxL0LmIvupZ',
        style: {
          width: '400px',
          height: '600px',
          borderRadius: '8px',
          primaryColor: '#3B82F6',
          theme: 'light'
        },
        onSuccess: function(paymentIntent: PaymentIntent) {
          console.log('Payment successful:', paymentIntent);
        },
        onError: function(error: Error) {
          console.error('Payment error:', error);
        },
        onCancel: function() {
          console.log('Payment cancelled');
        }
      });
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div id="sbtc-checkout-prod_tvXG_9G50M6ycAJf"></div>
  );
}