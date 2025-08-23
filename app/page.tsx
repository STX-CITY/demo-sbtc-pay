import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CustomerLookup from '@/components/CustomerLookup';



interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  price_usd?: number;
  images?: string[];
  created: number;
  checkout_url: string;
}

export default async function HomePage() {
  // Fetch products from sBTC Pay API
  let products: Product[] = [];
  try {


    debugger;
    const url = `${process.env.SBTC_PAY_API_URL}/api/v1/products`;
    console.log(url);
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SBTC_PAY_API_KEY}`,
      },
      cache: 'no-store',
    });


    
    if (response.ok) {
      const data = await response.json();
      products = data.data || [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                🛒 sBTC Digital Store
              </h1>
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                Pay with Bitcoin
              </span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/products" className="text-gray-600 hover:text-gray-900">
                All Products
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Digital Products with
              <span className="bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent"> Bitcoin Payments</span>
            </h2>
            <p className="text-xl md:text-2xl mb-10 opacity-90 leading-relaxed">
              Purchase digital products securely with sBTC - the future of Bitcoin payments on Stacks
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                🛒 Browse Products
              </Link>
              <Link
                href="#check-payments"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                🔍 Check My Payments
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-orange-300 bg-opacity-20 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-300 bg-opacity-15 rounded-full"></div>
        </div>
      </section>

      {/* Customer Lookup */}
      <CustomerLookup />

      {/* All Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Available Products</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our collection of digital products, all purchasable with secure Bitcoin payments
            </p>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📦</div>
              <h3 className="text-2xl font-medium text-gray-900 mb-4">No products available</h3>
              <p className="text-lg text-gray-600">Check back later for new products!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Use sBTCPay */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Use sBTCPay</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              sBTCPay is a Bitcoin payment processor that enables seamless Bitcoin transactions on the Stacks blockchain. 
              Build your own Bitcoin-powered applications with our developer-friendly APIs and tools.
            </p>
            <Link
              href="https://sbtcpay.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-all transform hover:scale-105 shadow-lg"
            >
              🚀 Visit sBTCPay.org
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">🛒 sBTC Digital Store</h3>
              <p className="text-gray-300 text-lg">Secure Bitcoin Payments for the Digital Age</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-8 text-sm">
              <div>
                <h4 className="font-semibold text-orange-400 mb-2">🔒 Security</h4>
                <p className="text-gray-400">Powered by sBTC on Stacks blockchain for secure, decentralized payments</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">⚡ Fast</h4>
                <p className="text-gray-400">Instant digital product delivery upon successful Bitcoin payment</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-2">🌐 Global</h4>
                <p className="text-gray-400">Accept Bitcoin payments from customers worldwide, 24/7</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400 text-sm">
                © 2025 sBTC Digital Store • Built with sBTC Pay • Demo Application
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

