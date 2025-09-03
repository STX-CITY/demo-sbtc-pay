import Script from 'next/script';

export default function WidgetPage() {
  return (
    <>
      <Script src="https://sbtcpay.org/widget.js" strategy="afterInteractive" />
      
      <div className="container mx-auto p-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">sBTCPay Widget Builder Demo</h1>

        <h2 className="text-xl font-semibold mb-4">Live Widget Preview</h2>
        
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


        
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-3">About Widget Builder</h2>
          <p className="text-gray-700 mb-4">
            Create drop-in payment widgets that your customers can add to any website with just a few lines of code.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">How to Use This Widget</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
            <li>Copy the generated code below</li>
            <li>Replace the placeholder API key with your public key</li>
            <li>Paste the code into your website's HTML</li>
            <li>The widget will automatically load and handle payments</li>
          </ol>
          
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
              <code>{`<!-- sBTC Inline Widget -->
<div data-sbtc-widget
     data-sbtc-key="YOUR_PUBLIC_API_KEY"
     data-product-id="YOUR_PRODUCT_ID"
     data-theme="light"
     data-color="#3B82F6"
     data-type="inline"
     data-show-amount="true"
     data-show-description="true">
</div>`}</code>
            </pre>
          </div>
        </div>
        
        
      </div>
    </>
  );
}