'use client';

import { useState } from 'react';

interface Transaction {
  payment_intent_id: string;
  amount: number;
  amount_usd: number;
  currency: string;
  status: string;
  description: string;
  tx_id: string;
  created: number;
  product: {
    id: string;
    name: string;
    description: string;
  };
}

interface CustomerData {
  object: string;
  customer: {
    identifier: string;
    address: string | null;
    email: string;
  };
  summary: {
    total_payments: number;
    successful_payments: number;
    total_spent: number;
    total_spent_usd: number;
    currency: string;
    unique_products_purchased: number;
    first_payment: number;
    last_payment: number;
  };
  products: Array<{
    id: string;
    name: string;
    description: string;
    purchase_count: number;
  }>;
  transactions: Transaction[];
}

export default function CustomerLookup() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookupCustomer = async () => {
    if (!identifier.trim()) return;

    setLoading(true);
    setError(null);
    setCustomerData(null);

    try {
      const response = await fetch(`/api/customers/${encodeURIComponent(identifier)}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Customer not found. No payments found for this email/address.');
        }
        throw new Error('Failed to lookup customer');
      }

      const data = await response.json();
      setCustomerData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup customer');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupCustomer();
  };

  return (
    <section id="check-payments" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Check Your Payments</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Enter your email address or Bitcoin address to view your complete payment history and purchased products
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-3xl mx-auto">
            <p className="text-sm text-blue-800 mb-2">
              <span className="font-semibold">Demo Feature:</span> This uses the sBTC Pay API GET /customers endpoint from{' '}
              <a 
                href="https://sbtcpay.org/docs#api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-900"
              >
                https://sbtcpay.org/docs#api
              </a> 
              <span> and it can only show payments for purchases from this website</span>
            </p>
            <p className="text-sm text-blue-700">
              💡 <span className="font-medium">Try sample customer:</span>{' '}
              <button
                onClick={() => setIdentifier('alex@gmail.com')}
                className="font-mono bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-blue-900 transition-colors"
              >
                alex@gmail.com
              </button>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter email address or Bitcoin address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
              <button
                type="submit"
                disabled={loading || !identifier.trim()}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  '🔍 Check Payments'
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {customerData && (
            <div className="space-y-6">
              {/* Customer Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {customerData.summary.successful_payments}
                    </div>
                    <div className="text-sm text-gray-600">Successful Payments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      ${customerData.summary.total_spent_usd}
                    </div>
                    <div className="text-sm text-gray-600">Total Spent (USD)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {customerData.summary.unique_products_purchased}
                    </div>
                    <div className="text-sm text-gray-600">Products Purchased</div>
                  </div>
                </div>
              </div>

              {/* Products Purchased */}
              {customerData.products.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Products Purchased</h4>
                  <div className="grid gap-4">
                    {customerData.products.map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h5 className="font-medium text-gray-900">{product.name}</h5>
                          <p className="text-sm text-gray-600">{product.description}</p>
                          <span className="inline-block mt-1 px-2 py-1 bg-gray-200 text-gray-600 text-xs font-mono rounded">
                            {product.id}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {product.purchase_count}x
                          </div>
                          <div className="text-sm text-gray-600">purchases</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Transactions */}
              {customerData.transactions.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h4>
                  <div className="space-y-4">
                    {customerData.transactions.map((tx) => (
                      <div key={tx.payment_intent_id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-medium text-gray-900">{tx.product.name}</h5>
                            <p className="text-sm text-gray-600">{tx.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              ${tx.amount_usd}
                            </div>
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              tx.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                              tx.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Payment ID: {tx.payment_intent_id}</div>
                          <div>Transaction: {tx.tx_id}</div>
                          <div>Date: {new Date(tx.created * 1000).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}