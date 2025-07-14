import { useEffect, useState } from 'react';


const TotalInvestmentCard = () => {
  const [balance, setBalance] = useState(1231);
  const [change, setChange] = useState({ value: 23, percent: 34 });
{/*
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('/api/portfolio/summary');
      setBalance(res.data.totalBalance);
      setChange({
        value: res.data.changeAmount,
        percent: res.data.changePercent,
      });
    };
    fetchData();
  }, []);
*/}
  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-sm mx-auto text-center">
      <h2 className="text-xl font-semibold text-gray-800">Total Balance</h2>
      <p className="text-3xl font-bold text-green-600 mt-2">${balance}</p>
      <p className="text-sm text-gray-500 mt-1">
        {change.value >= 0 ? '+' : '-'}${Math.abs(change.value).toFixed(2)} ({Math.abs(change.percent).toFixed(2)}%)
      </p>
    </div>
  );
};

export default TotalInvestmentCard;
