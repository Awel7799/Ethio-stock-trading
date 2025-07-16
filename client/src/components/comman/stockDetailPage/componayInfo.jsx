const CompanyInfo = ({ data }) => (
  <div className="mb-4 p-4 border rounded shadow bg-white">
    <h2 className="text-2xl font-bold">{data.name} ({data.symbol})</h2>
    <p>Price: ${data.price}</p>
    <p>Dividend: {data.dividend}</p>
    <p className="text-gray-600">{data.description}</p>
  </div>
);

export default CompanyInfo;
