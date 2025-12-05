"use client";

import { useState } from "react";

export type NewsItem = {
  title: string;
  urlToImage: string | null;
  description?: string;
  url?: string | null;
  publishedAt?: string;   // API news
  created_at?: string;    // Admin news
  image_url?: string | null; // admin images
};



interface CNNGridProps {
  news: NewsItem[];
}

export default function CNNGrid({ news }: CNNGridProps) {
  const [visibleCount, setVisibleCount] = useState(10);

  // Filter out empty titles
  const filtered = news.filter((n) => n && n.title);

  const visibleNews = filtered.slice(0, visibleCount);

  if (!visibleNews.length) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-center text-gray-600">No news available.</p>
      </section>
    );
  }

  const main = visibleNews[0];
  const rest = visibleNews.slice(1);

  function formatDate(dateString?: string) {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return ""; // prevents crashes
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }


  return (
    <section className="max-w-7xl mx-auto px-4 py-8">

      {/* MAIN STORY */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">

        {/* Main Image */}
        <a
          href={main.url || "#"}
          target={main.url ? "_blank" : "_self"}
          rel="noreferrer"
        >
          <img
            src={main.urlToImage || undefined}
            alt={main.title}
            className="w-full h-64 md:h-80 object-cover rounded cursor-pointer"
          />
        </a>

        {/* Main Text */}
        <div className="flex flex-col justify-center">
          <a
            href={main.url || undefined}
            target={main.url ? "_blank" : undefined}
            rel="noreferrer"
          >
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4 hover:text-red-600 cursor-pointer">
              {main.title}
            </h1>
          </a>

          {main.description && (
            <p className="text-gray-700">{main.description}</p>
          )}

          <p className="text-xs text-gray-500 mt-2">
            {formatDate(main.publishedAt || main.created_at)}
          </p>
        </div>
      </div>

      {/* OTHER STORIES */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rest.map((story, index) => (
          <a
            key={index}
            href={story.url || undefined}
            target={story.url ? "_blank" : undefined}
            rel="noreferrer"
            className="pb-4 flex flex-col gap-3 cursor-pointer"
          >
            {story.urlToImage && (
              <img
                src={story.urlToImage}
                alt={story.title}
                className="w-full h-40 object-cover rounded"
              />
            )}

            <h2 className="text-lg font-semibold leading-snug hover:text-red-600">
              {story.title}
            </h2>

            {story.description && (
              <p className="text-sm text-gray-700 line-clamp-3">
                {story.description}
              </p>
            )}

            <p className="text-xs text-gray-500">
              {formatDate(story.publishedAt || story.created_at)}
            </p>
          </a>
        ))}
      </div>

      {/* LOAD MORE */}
      {visibleCount < filtered.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 9)}
            className="px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700"
          >
            Load more news
          </button>
        </div>
      )}
    </section>
  );
}
