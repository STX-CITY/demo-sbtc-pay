import Script from 'next/script';

export default function WidgetPage() {
  return (
    <>
      <Script src="https://sbtcpay.org/widget.js" strategy="afterInteractive" />
      
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">sBTC Payment Widget Demo</h1>
        
        {/* sBTC Inline Widget */}
        <div data-sbtc-widget
             data-sbtc-key="pk_test_XFVEe_ToHEQ31w0f1oQpcGAO4HI9qZca"
             data-product-id="prod_fcp_JpCwaWsKUU8Z"
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