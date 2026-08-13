"use client";

import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
    localStorage.removeItem("user_name");
    alert("logged out successfully !");
    window.location.reload();
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
          <motion.header
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur"
          >
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-extrabold"
              >
                <Link href="/">
                  Diagnostic <span className="text-cyan-400">AI</span>
                </Link>
              </motion.h1>

              {!token && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <button
                    onClick={() => handleNavigate("/signin")}
                    className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-slate-600 transition-colors shadow-lg shadow-slate-500/10"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => handleNavigate("/signup")}
                    className="text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-cyan-500/10"
                  >
                    Get Started
                  </button>
                </motion.div>
              )}

              {token && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <button
                    onClick={() => handleNavigateWithOutputLoader("/settings")}
                    className="text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-xl transition-colors shadow-lg shadow-cyan-500/10"
                  >
                    User Profile
                  </button>

                  <button
                    onClick={() => logOut()}
                    className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl border border-slate-600 transition-colors shadow-lg shadow-slate-500/10"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          </motion.header>

          <main className="flex-1 min-w-0 overflow-x-hidden">
            <section className="relative overflow-hidden py-24">
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 via-slate-950 to-blue-600/20"></div>

              <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center px-6">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-2 text-cyan-300"
                  >
                    Medical AI Platform
                  </motion.span>

                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-8 text-6xl font-black leading-tight"
                  >
                    AI Powered
                    <span className="block text-cyan-400">
                      Medical Intelligence
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-6 max-w-xl text-lg text-slate-300"
                  >
                    Upload medical reports to extract text with AI OCR, generate
                    LLM-powered summaries, chat with documents, compare reports,
                    and get intelligent medical insights in seconds
                  </motion.p>

                  {token && (
                    <motion.div
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.7 }}
                      className="mt-10 flex gap-4"
                    >
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
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl"
                  >
                    <Image
                      src={bloodReportImg}
                      alt="Blood Test Report"
                      className="w-full h-full object-cover"
                      priority
                    />
                  </motion.div>
                </motion.div>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 py-20">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7 }}
                className="text-center text-4xl font-bold mb-14"
              >
                What We Offer
              </motion.h2>

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
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                    }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.2 },
                    }}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 hover:-translate-y-2 transition duration-300"
                  >
                    <motion.div
                      whileHover={{
                        rotate: 180,
                        scale: 1.15,
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-4xl mb-5"
                    >
                      ✦
                    </motion.div>

                    <h3 className="text-xl font-bold">{feature.title}</h3>

                    <p className="mt-4 text-slate-400">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </main>

          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t border-slate-900 bg-slate-950 text-slate-400 py-12 mt-auto"
          >
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-bold text-white">
                  Diagnostic <span className="text-cyan-400">AI</span>
                </h3>

                <p className="text-sm text-slate-500">
                  Next-generation AI tools built specifically for medical report
                  understanding, analysis, and intelligent document workflows.
                </p>
              </motion.div>

              {token && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                    Platform
                  </h4>

                  <ul className="space-y-2.5 text-sm">
                    <li>
                      <button
                        onClick={() =>
                          handleNavigateWithOutputLoader("/comparison")
                        }
                        className="hover:text-cyan-400 transition-colors"
                      >
                        Dashboard
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() =>
                          handleNavigateWithOutputLoader("/document-chat")
                        }
                        className="hover:text-cyan-400 transition-colors"
                      >
                        Upload Document
                      </button>
                    </li>

                    <li>
                      <button
                        onClick={() =>
                          handleNavigateWithOutputLoader("/report-analysis")
                        }
                        className="hover:text-cyan-400 transition-colors"
                      >
                        Report Analysis
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
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
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-900 text-xs text-slate-500 flex flex-col md:flex-row justify-between gap-4"
            >
              <p>&copy; 2026 Diagnostic AI. All rights reserved.</p>
            </motion.div>
          </motion.footer>
        </div>
      )}
    </>
  );
}
