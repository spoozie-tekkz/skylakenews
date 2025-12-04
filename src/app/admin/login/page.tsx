"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";  // <-- ADD THIS

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASS;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("skylake-admin", "true");
        router.push("/admin/dashboard");
    } else {
        setError("Invalid email or password.");
        setLoading(false);
    }
    }


  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ⭐ TOP NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          
          {/* Envelope Icon */}
          <div className="flex justify-center mb-6">
            <img
              src="/email-box.png"   // your icon
              alt="Mail icon"
              className="w-[38px] h-[38px] object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-center text-[28px] font-serif mb-8 text-black">
            Sign in with email
          </h1>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm text-black mb-1">
                Your email
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f3f3f3] border border-[#e5e5e5] rounded-md py-[10px] px-3 text-[16px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-black mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f3f3f3] border border-[#e5e5e5] rounded-md py-[10px] px-3 text-[16px] text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Button */}
            <button
            type="submit"
            disabled={loading}
            className={`w-full bg-black text-white py-2.5 rounded-full text-[15px] transition 
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
                    ></circle>
                    <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                </svg>
                <span>Loading...</span>
                </div>
            ) : (
                "Continue"
            )}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
