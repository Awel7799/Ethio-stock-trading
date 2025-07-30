import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStockDetails } from '../../../services/stockAPI';

const StockDetailPage = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStockDetails(symbol);
        setStock(data);
      } catch (err) {
        console.error('Failed to load stock details:', err);
      }
    };
    loadData();
  }, [symbol]);

  if (!stock) return <div>Loading...</div>;

  return (
    <div className="stock-detail-page">
      <div className="header">
        <img src={stock.logo} alt={`${stock.name} logo`} width={50} />
        <h2>{stock.name}</h2>
      </div>
      <div className="price-info">
        <h3>${stock.price}</h3>
        <span style={{ color: stock.changesPercentage > 0 ? 'green' : 'red' }}>
          ({stock.changesPercentage}%)
        </span>
      </div>

      <div className="about">
        <h4>About</h4>
        <p>{stock.description}</p>
      </div>
    </div>
  );
};

export default StockDetailPage;
