"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      alert("please enter your name !");
      return;
    }
    if (!formData.email) {
      alert("please enter your email !");
      return;
    }
    if (!formData.password) {
      alert("please enter your password !");
      return;
    }
    if (formData.password.length < 8) {
      alert("password length should be 8 !");
      return;
    }
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/signup",
        formData,
      );
      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("registration failed !");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden text-white">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight">
            Patient<span className="text-cyan-400">Graph AI</span>
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Request platform access to analyze clinical data.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Dr. Sarah Chen"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Work Email
            </label>
            <input
              type="email"
              required
              placeholder="schen@research.org"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Medical License / ID
            </label>
            <input
              type="text"
              required
              placeholder="NPI or License Num"
              value={formData.licenseNumber}
              onChange={(e) =>
                setFormData({ ...formData, licenseNumber: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl font-bold transition duration-200 shadow-lg shadow-cyan-500/10 mt-4"
          >
            Create Researcher Account
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-sm text-center text-slate-400 mt-8">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-cyan-400 font-semibold hover:underline"
          >
            Sign In instead
          </Link>
        </p>
      </div>
    </div>
  );
}
