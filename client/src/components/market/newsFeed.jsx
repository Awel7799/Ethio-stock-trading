// File: src/components/market/NewsFeed.jsx

import React from 'react';

const news = [
  {
    id: 1,
    title: 'Tesla shares surge after record Q2 earnings',
    description:
      'Tesla posts record earnings and beats Wall Street expectations, sending the stock soaring.',
    imageUrl: 'https://source.unsplash.com/random/300x200?tesla',
    source: 'CNBC',
  },
  {
    id: 2,
    title: 'Apple unveils new M3 chips in surprise launch',
    description:
      'Apple has announced its new generation M3 chip that boosts performance in all Mac devices.',
    imageUrl: 'https://source.unsplash.com/random/300x200?apple',
    source: 'Bloomberg',
  },
  {
    id: 3,
    title: 'Amazon enters the healthcare space',
    description:
      'Amazon is acquiring a major pharmacy startup to expand its services in the healthcare sector.',
    imageUrl: 'https://source.unsplash.com/random/300x200?amazon',
    source: 'TechCrunch',
  },
];

const NewsFeed = () => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md w-full max-w-3xl mx-auto mt-6">
      <h2 className="text-lg font-semibold mb-4">Market News</h2>
      <div className="flex flex-col gap-6">
        {news.map((article) => (
          <div
            key={article.id}
            className="flex items-start gap-4 border rounded-md p-4 hover:shadow transition"
          >
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-32 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="text-md font-bold">{article.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{article.description}</p>
              <p className="text-xs text-gray-400 mt-2">Source: {article.source}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
