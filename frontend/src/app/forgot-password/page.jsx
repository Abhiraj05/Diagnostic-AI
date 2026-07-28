"use client";

import Link from "next/link";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">

        <div className="text-center">

          <h1 className="text-4xl font-black text-white">
            Forgot
            <span className="text-cyan-400"> Password</span>
          </h1>

          <p className="mt-3 text-slate-400">
            Enter your registered email address.
            We'll send you a password reset link.
          </p>

        </div>

        <form className="mt-10 space-y-6">

          <div>

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="example@gmail.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />

          </div>

          <button
            className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-900 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
          >
            Send Reset Link
          </button>

        </form>

        <div className="mt-8 text-center">

          <Link
            href="/signin"
            className="text-cyan-400 hover:text-cyan-300"
          >
            ← Back to Sign In
          </Link>

        </div>

      </div>

    </div>
  );
}