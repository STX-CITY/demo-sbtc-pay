'use client';

import { useEffect } from 'react';

export default function TestFormPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sbtcpay.org/embed/checkout.js';
    script.onload = function() {
      (window as any).SBTCPay.createCheckout({
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
        onSuccess: function(paymentIntent: any) {
          console.log('Payment successful:', paymentIntent);
        },
        onError: function(error: any) {
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