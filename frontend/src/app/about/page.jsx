"use client";

import Link from "next/link";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const router = useRouter();
  const [token, setToken] = useState(null);

  const handleNavigate = (route) => {
    setTimeout(() => {
      router.push(route);
    }, 2000);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);
  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white">
        <section className="relative overflow-hidden py-10">
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 via-slate-950 to-blue-600/20" />

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-cyan-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-300"
            >
              <span className="material-symbols-outlined text-[20px]">
                arrow_back
              </span>
              Back to Home
            </Link>

            <div className="mt-14 text-center">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-cyan-300">
                About Diagnostic AI
              </span>

              <h1 className="mt-8 text-5xl md:text-6xl font-black">
                Revolutionizing
                <span className="block text-cyan-400">
                  Medical Intelligence
                </span>
              </h1>

              <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-300 leading-8">
                Diagnostic AI is an intelligent medical report platform that
                enables users to extract text with AI OCR, generate LLM-powered
                summaries, chat with reports, compare medical documents, and
                gain AI-driven insights—all in one place.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
              <h2 className="text-3xl font-bold text-cyan-400">Our Mission</h2>

              <p className="mt-6 text-slate-300 leading-8">
                Our mission is to make medical reports easier to understand
                through AI-powered OCR, intelligent summaries, document chat,
                report comparison, and advanced analysis.
              </p>

              <p className="mt-5 text-slate-300 leading-8">
                We leverage advanced AI technologies to automate medical report
                understanding through AI OCR, intelligent summaries, document
                chat, report comparison, and in-depth analysis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {[
                "AI OCR",
                "LLM Summary",
                "Document Chat",
                "Report Comparison",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-700 bg-slate-900 p-8 text-center"
                >
                  <div className="text-4xl mb-4">✦</div>
                  <h3 className="font-semibold text-cyan-400">{item}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              ["99%", "OCR Accuracy"],
              ["10K+", "Medical Reports"],
              ["24/7", "AI Availability"],
              ["100%", "Secure Processing"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-8 text-center"
              >
                <h3 className="text-5xl font-black text-cyan-400">{value}</h3>

                <p className="mt-4 text-slate-300">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {token && (
          <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="rounded-3xl border border-cyan-500/20 bg-linear-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-xl p-14 text-center">
              <h2 className="text-4xl font-bold">Experience AI Healthcare</h2>

              <p className="mt-6 text-slate-300 max-w-2xl mx-auto">
                Upload your medical reports, extract text with AI OCR, generate
                intelligent summaries, chat with your documents, compare
                reports, and gain AI-powered insights in seconds.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => handleNavigate("/document-chat")}
                  className="rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-slate-900 transition hover:bg-cyan-400"
                >
                  Upload Report
                </button>

                <button
                  onClick={() => handleNavigate("/comparison")}
                  className="rounded-xl border border-slate-700 px-8 py-4 transition hover:bg-slate-900"
                >
                  Open Dashboard
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
