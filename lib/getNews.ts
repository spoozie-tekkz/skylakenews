import axios from "axios";

export async function fetchNews() {
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;
  const { data } = await axios.get(url);
  return data.articles;
}
