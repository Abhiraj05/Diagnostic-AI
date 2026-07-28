"use client";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import axios from "axios";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
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

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/update-profile",
        formData,
      );
      alert(response.data.message);
      return
    } catch (error) {
      console.log(error);
      alert("profile updation failed !");
      return
    }
  };
  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      <Sidebar />
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Simple Header */}
        <header className="sticky top-0 z-40 h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </header>

        {/* Core Content Container */}
        <div className="max-w-5xl mx-auto w-full p-8 space-y-10 flex-1">
          {/* 1. Profile Settings Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="border-b border-slate-800/60 p-8">
                <h2 className="text-2xl font-bold text-white">
                  Profile Settings
                </h2>
                <p className="text-base text-slate-400 mt-2">
                  Manage your account information and preferences.
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-base font-semibold text-slate-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg text-white outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-base font-semibold text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-lg text-white outline-none focus:border-cyan-400 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/40 px-8 py-5 border-t border-slate-800/60 flex justify-end gap-4">
                <button className="px-6 py-2.5 text-base font-bold text-slate-400 hover:text-white rounded-xl transition-colors">
                  Cancel
                </button>
                <button className="px-6 py-2.5 text-base font-bold text-slate-900 bg-cyan-500 hover:bg-cyan-400 rounded-xl transition-colors shadow-lg shadow-cyan-500/10">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
