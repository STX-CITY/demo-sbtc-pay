import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

const SBTC_PAY_API_URL = process.env.SBTC_PAY_API_URL || 'http://localhost:3000';

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

interface ProductPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductPageProps) {
  const params = await searchParams;
  const { search } = params;

  // Fetch products from sBTC Pay API
  let products: Product[] = [];
  try {
    const response = await fetch(`${SBTC_PAY_API_URL}/api/v1/products`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SBTC_PAY_API_KEY}`,
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (response.ok) {
      const data = await response.json();
      products = data.data || []; // sBTC Pay returns { data: [...] }
    } else {
      console.error('Failed to fetch products from sBTC Pay API');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  // Apply search filtering
  let filteredProducts = products;
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      (product.description && product.description.toLowerCase().includes(searchTerm))
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                🛒 sBTC Digital Store
              </Link>
              <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">
                Pay with Bitcoin
              </span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/products" className="text-blue-600 font-medium">
                All Products
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Digital Products</h1>
          <p className="text-gray-600">
            Browse and purchase digital products with Bitcoin
          </p>
        </div>

        {/* Simple Search */}
        <div className="mb-8">
          <form method="GET" className="flex gap-4">
            <input
              name="search"
              type="text"
              placeholder="Search products..."
              defaultValue={search || ''}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            {search && ` matching "${search}"`}
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-gray-600 mb-6">
              {search ? 'Try a different search term' : 'Check back later for new products!'}
            </p>
            {search && (
              <Link
                href="/products"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                View All Products
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


