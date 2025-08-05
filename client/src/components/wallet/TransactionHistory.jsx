// client/src/components/wallet/TransactionHistory.jsx
import React, { useState, useEffect } from 'react';
import { formatDate, formatCurrency, getBankName } from '../../utils/formatters';
import { fetchTransactions } from '../../services/walletApi';

export default function TransactionHistory(){
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });

  const loadTransactions = async (page = 1) => {
    try {
      setLoading(true);
      const { transactions: data, pagination: pg } = await fetchTransactions(page, pagination.limit);
      
      setTransactions(data);
      setPagination({
        page: pg.current_page,
        limit: pagination.limit,
        total: pg.total_transactions,
        totalPages: pg.total_pages
      });
      
    } catch (err) {
      setError('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  if (error) return <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>;

  return (
    <div className="overflow-hidden">
      <div className="min-w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Bank</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{formatDate(tx.initiated_at)}</td>
                  <td className="p-3 capitalize">{tx.type}</td>
                  <td className="p-3">{getBankName(tx.bank_code)}</td>
                  <td className={`p-3 text-right font-medium ${
                    tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'deposit' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-800' :
                      tx.status === 'failed' || tx.status === 'cancelled' ? 
                        'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => loadTransactions(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="text-sm">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => loadTransactions(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

