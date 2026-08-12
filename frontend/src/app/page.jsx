"use client";

import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import bloodReportImg from "@/assets/bloodtestimg.jpg";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  const handleNavigate = (route) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(route);
    }, 2000);
  };

  const handleNavigateWithOutputLoader = (route) => {
    router.push(route);
  };

  const logOut = () => {
    localStorage.removeItem("access_token");
    alert("logged out successfully !");
    return;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    setToken(storedToken);
  }, []);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
              <h1 className="text-2xl font-extrabold">
                <Link href="/">
                  Diagnostic <span className="text-cyan-400">AI</span>
                </Link>
              </h1>
              {!token && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleNavigate("/signin")}
                    className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleNavigate("/signup")}
                    className="text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-cyan-500/10"
                  >
                    Get Started
                  </button>
                </div>
              )}

              {token && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleNavigateWithOutputLoader("/settings")}
                    className="text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-cyan-500/10"
                  >
                    User Profile
                  </button>
                  <button
                    onClick={() => logOut()}
                    className="text-sm font-semibold text-slate-300 hover:text-white  px-4 py-2 rounded-xl border border-slate-600 transition-colors shadow-lg shadow-slate-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 min-w-0 overflow-x-hidden">
            <section className="relative overflow-hidden py-24">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 via-slate-950 to-blue-600/20"></div>

              <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center px-6">
                <div>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-cyan-300">
                    Medical AI Platform
                  </span>

                  <h1 className="mt-8 text-6xl font-black leading-tight">
                    AI Powered
                    <span className="block text-cyan-400">
                      Medical Intelligence
                    </span>
                  </h1>

                  <p className="mt-6 max-w-xl text-lg text-slate-300">
                    Upload medical reports to extract text with AI OCR, generate
                    LLM-powered summaries, chat with documents, compare reports,
                    and get intelligent medical insights in seconds
                  </p>

                  {token && (
                    <div className="mt-10 flex gap-4">
                      <button
                        onClick={() =>
                          handleNavigateWithOutputLoader("/document-chat")
                        }
                        className="rounded-xl bg-cyan-500 px-8 py-4 font-semibold hover:bg-cyan-400 grid place-items-center text-slate-900"
                      >
                        Upload Report
                      </button>

                      <button
                        onClick={() =>
                          handleNavigateWithOutputLoader("/comparison")
                        }
                        href="/comparison"
                        className="rounded-xl border border-slate-700 px-8 py-4 hover:bg-slate-900 grid place-items-center"
                      >
                        Dashboard
                      </button>
                    </div>
                  )}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                  <div className="rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl">
                    <Image
                      src={bloodReportImg}
                      alt="Blood Test Report"
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 py-20">
              <h2 className="text-center text-4xl font-bold mb-14">
                What We Offer
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "AI OCR",
                    desc: "Extract text from medical reports with high accuracy using advanced OCR.",
                  },
                  {
                    title: "LLM Summary",
                    desc: "Generate concise and intelligent summaries of complex medical reports.",
                  },
                  {
                    title: "Document Chat",
                    desc: "Ask questions and get instant AI-powered answers from your reports.",
                  },
                  {
                    title: "Report Comparison",
                    desc: "Compare multiple medical reports to identify changes and trends.",
                  },
                  {
                    title: "Report Analysis",
                    desc: "Analyze lab reports and medical documents with AI-driven insights.",
                  },
                  {
                    title: "Secure Storage",
                    desc: "Store medical reports securely with fast access and privacy protection.",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 hover:-translate-y-2 transition duration-300"
                  >
                    <div className="text-4xl mb-5">✦</div>

                    <h3 className="text-xl font-bold">{feature.title}</h3>

                    <p className="mt-4 text-slate-400">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </main>
          <footer className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">
                  Diagnostic <span className="text-cyan-400">AI</span>
                </h3>
                <p className="text-sm text-slate-500">
                  Next-generation AI tools built specifically for medical report
                  understanding, analysis, and intelligent document workflows.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Platform
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <button
                      onClick={() => handleNavigate("/comparison")}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("/pdf-chat")}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Upload Document
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("/report-analysis")}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Report Analysis
                    </button>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Support
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <button
                      onClick={() => handleNavigate("/feedback")}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      Feedback
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigate("/about")}
                      className="hover:text-cyan-400 transition-colors"
                    >
                      About
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-900 text-xs text-slate-500 flex flex-col md:flex-row justify-between gap-4">
              <p>&copy; 2026 Diagnostic AI. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
