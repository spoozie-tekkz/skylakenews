"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../../lib/supabase";
import Navbar from "@/components/Navbar";

export default function AdminDashboard() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [articleUrl, setArticleUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [newArticleLink, setNewArticleLink] = useState("");

  // ---- Auth guard ----
  useEffect(() => {
    const isLoggedIn =
      typeof window !== "undefined"
        ? localStorage.getItem("skylake-admin")
        : null;

    if (!isLoggedIn) router.push("/admin/login");
  }, []);

  // ---- Submit ----
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !imageFile) {
      setToast("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setToast("");
    setNewArticleLink("");

    try {
      // Upload image
      const ext = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("news-images")
        .upload(fileName, imageFile);

      if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError);
        setToast(uploadError.message || "Image upload failed.");
        setLoading(false);
        return;
      }


      const { data: publicData } = supabase.storage
        .from("news-images")
        .getPublicUrl(fileName);

      const imageUrl = publicData.publicUrl;

      // Insert into DB
      const { data, error } = await supabase
        .from("custom_news")
        .insert({
          title,
          description: description || null,
          url: articleUrl || null,
          image_url: imageUrl,
        })
        .select("id")  // <-- get the ID that was inserted
        .single();

      if (error) {
        setToast("Failed to publish article.");
      } else {
        const link = `${window.location.origin}/`;
        setNewArticleLink(link);

        setToast("News posted successfully!");
        setTitle("");
        setDescription("");
        setArticleUrl("");
        setImageFile(null);
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("skylake-admin");
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-white text-black flex flex-col">

      {/* ⭐ REAL NAVBAR */}
      <Navbar />

        {/* ⭐ Admin bar + Logout */}
        <div className="w-full border-b border-gray-200 bg-white py-2">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">Admin Panel</span>

            <button
            onClick={logout}
            className="text-sm border border-gray-300 px-4 py-1 rounded-full hover:bg-gray-100 transition"
            >
            Logout
            </button>
        </div>
        </div>


      {/* CONTENT */}
      <div className="flex-1 max-w-3xl mx-auto px-4 py-10">

        <h2 className="text-3xl font-serif mb-6">Create an article</h2>

        {/* TOAST */}
        {toast && (
          <div className="mb-5 text-sm text-center py-2 bg-black text-white rounded">
            {toast}

            {/* If success: show share link */}
            {newArticleLink && (
              <div className="mt-2">

                <a
                  href={newArticleLink}
                  target="_blank"
                  className="underline text-gray-200"
                >
                  View article →
                </a>

                <button
                onClick={() => {
                    navigator.clipboard.writeText(newArticleLink);
                    setToast("Link copied to clipboard!");
                }}
                className="ml-3 underline text-gray-200"
                >
                Copy link
                </button>

              </div>
            )}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm mb-1 font-medium">Title *</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Breaking: Something big happened..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              Short description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-3 text-sm h-28 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="One or two lines summarizing the story..."
            />
          </div>

          {/* Source URL */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              Source URL (optional)
            </label>
            <input
              value={articleUrl}
              onChange={(e) => setArticleUrl(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="https://"
            />
          </div>

          {/* Image REQUIRED */}
          <div>
            <label className="block text-sm mb-1 font-medium">
              Featured Image *
            </label>
            <input
              required
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-full bg-black text-white text-sm font-medium transition 
              ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-opacity-90"}`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Publishing...
              </div>
            ) : (
              "Publish article"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
