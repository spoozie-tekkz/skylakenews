import CNNGrid, { NewsItem } from "@/components/CNNGrid";
import { fetchNews } from "../../lib/getNews";
import { fetchCustomNews } from "../../lib/customNews";
import Navbar from "@/components/Navbar";

export default async function HomePage() {
  const [apiNews, adminNews] = await Promise.all([
    fetchNews(),        // News API articles
    fetchCustomNews(),  // Supabase admin articles
  ]);

  // --- Convert admin news into NewsItem structure ---
  const formattedAdmin: NewsItem[] = adminNews.map((item: any) => ({
    title: item.title,
    description: item.description || "",
    urlToImage: item.image_url,
    url: item.url || null, // clicking opens external link ONLY
  }));

  // --- API News is already in NewsItem format ---
  const formattedAPI: NewsItem[] = apiNews.map((item: any) => ({
    title: item.title,
    description: item.description || "",
    urlToImage: item.urlToImage,
    url: item.url || null,
  }));

  // --- Admin first, API next ---
  const combined: NewsItem[] = [...formattedAdmin, ...formattedAPI];

  return (
    <main className="bg-white min-h-screen text-black">
      <Navbar />
      <CNNGrid news={combined} />
    </main>
  );
}
