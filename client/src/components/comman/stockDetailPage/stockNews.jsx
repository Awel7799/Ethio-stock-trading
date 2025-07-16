const StockNews = ({ news }) => (
  <div className="p-4 bg-white rounded shadow">
    <h3 className="text-lg font-semibold mb-2">Related News</h3>
    {news.map((n, index) => (
      <div key={index} className="border-t py-2">
        <h4 className="font-bold">{n.title}</h4>
        <p>{n.description}</p>
      </div>
    ))}
  </div>
);

export default StockNews;
