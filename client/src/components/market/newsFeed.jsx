import React, { useEffect, useState } from "react";
import { fetchMarketNews } from "../../services/newsServices";

const NewsFeed = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketNews()
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading news...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-[90vw] rounded-lg p-1  mx-0 mt-6 shadow-lg">
      <h2 className="text-4xl font-semibold mb-6 text-gray-800 border-b pb-2">Market News</h2>
      <div className="flex  flex-col gap-6">
        {news.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-[90vw] items-start gap-5 shadow-md rounded-md p-4 hover:shadow-xl transition duration-300 bg-gray-50 hover:bg-white"
          >
            <img
              src={article.urlToImage || "https://via.placeholder.com/150?text=No+Image"}
              alt={article.title}
              className="w-40 h-28 object-cover rounded-md flex-shrink-0"
            />
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-gray-900">{article.title}</h3>
              <p className="text-sm text-gray-700 mt-1 line-clamp-3">
                {article.description || "No description available."}
              </p>
              <p className="text-xs text-gray-500 mt-3">
                Source: <span className="font-semibold">{article.source?.name || "Unknown"}</span> •{" "}
                {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
