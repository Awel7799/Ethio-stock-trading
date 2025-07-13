import { useState } from 'react';

const StockSearchBar = ({ stocks, onResult }) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    const result = stocks.filter(stock =>
      stock.name.toLowerCase().includes(keyword.toLowerCase())
    );
    onResult(result);
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Search stocks by company name..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        Search
      </button>
    </div>
  );
};

export default StockSearchBar;
