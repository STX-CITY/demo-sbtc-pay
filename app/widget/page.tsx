import Script from 'next/script';

export default function WidgetPage() {
  return (
    <>
      <Script src="http://localhost:3000/widget.js" strategy="afterInteractive" />
      
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">sBTC Payment Widget Demo</h1>
        
        {/* sBTC Inline Widget */}
        <div data-sbtc-widget
             data-sbtc-key="pk_test_bKtnwPcfUSvyFyr28CVaMmxL0LmIvupZ"
             data-product-id="prod_tvXG_9G50M6ycAJf"
             data-theme="light"
             data-color="#3B82F6"
             data-type="inline"
             data-show-amount="true"
             data-show-description="true">
        </div>
      </div>
    </>
  );
}