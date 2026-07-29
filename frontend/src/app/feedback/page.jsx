"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function FeedbackPage() {
  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    user_feedback: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.user_name) {
      alert("Please enter your name!");
      return;
    }

    if (!formData.user_email) {
      alert("Please enter your email!");
      return;
    }

    if (!formData.user_feedback.trim()) {
      alert("Please enter your feedback!");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/feedback",
        formData,
      );

      alert(response.data.message);

     
      setFormData({
        user_name: "",
        user_email: "",
        user_feedback: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to submit feedback!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden text-white">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-cyan-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-300"
        >
          <span className="material-symbols-outlined text-[20px]">
            arrow_back
          </span>
          Back to Home
        </Link>

        {/* Main Content */}
        <div className="mt-10 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-cyan-500/10 border border-cyan-400/20 px-5 py-2 text-cyan-400 font-semibold text-sm mb-8">
              Contact Us
            </span>

            <h1 className="text-5xl lg:text-5xl font-black leading-tight">
              Let's Talk About Your
              <br />
              <span className="text-white">Feedback</span>
            </h1>

            <p className="mt-8 text-lg text-slate-400 leading-8 max-w-lg">
              Have questions, suggestions, or feedback? We'd love to hear from
              you. Reach out to our team and we'll get back to you as soon as
              possible.
            </p>

            {/* Contact Details */}
            <div className="mt-12 space-y-7">
              {/* Email */}
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl border border-slate-700 bg-white/5 flex items-center justify-center text-cyan-400 text-2xl">
                  ✉
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-xl font-semibold">
                    support@yourwebsite.com
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl border border-slate-700 bg-white/5 flex items-center justify-center text-cyan-400 text-2xl">
                  ☎
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Phone</p>
                  <p className="text-xl font-semibold">+91 98765 43210</p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-5">
                <div className="h-14 w-14 rounded-2xl border border-slate-700 bg-white/5 flex items-center justify-center text-cyan-400 text-2xl">
                  📍
                </div>

                <div>
                  <p className="text-slate-400 text-sm">Location</p>
                  <p className="text-xl font-semibold">Goa, India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black tracking-tight">
                Send <span className="text-cyan-400">Feedback</span>
              </h1>

              <p className="text-sm text-slate-400 mt-2">
                We'd love to hear your thoughts and suggestions.
              </p>
            </div>

            {/* Your Existing Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  name="user_name"
                  placeholder="John Doe"
                  value={formData.user_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="user_email"
                  placeholder="johndoe@gmail.com"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Feedback
                </label>

                <textarea
                  name="user_feedback"
                  rows={5}
                  placeholder="Write your feedback here..."
                  value={formData.user_feedback}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white placeholder-slate-500 outline-none resize-none focus:border-cyan-400 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl font-bold transition duration-200 shadow-lg shadow-cyan-500/10 mt-4"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
