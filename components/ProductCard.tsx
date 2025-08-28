'use client';

import Image from 'next/image';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        {product.images && product.images.length > 0 ? (
          <Image 
            src={product.images[0]} 
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-4xl text-white">📱</span>
        )}
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-gray-900 text-lg">{product.name}</h4>
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded">
            {product.id}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ${product.price_usd ? product.price_usd.toFixed(2) : (product.price / 100).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">≈ {(product.price / 100_000_000).toFixed(8)} sBTC</p>
          </div>
          <button
            onClick={() => window.open(product.checkout_url, '_blank', 'noopener,noreferrer')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}