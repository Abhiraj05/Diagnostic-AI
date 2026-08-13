"use client";

import Link from "next/link";

export default function RegistrationSuccess() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center">

        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/30">
          <span className="text-5xl text-cyan-400">
            ✓
          </span>
        </div>


        <h1 className="mt-8 text-3xl font-black text-white tracking-tight">
          Registration
          <span className="text-cyan-400"> Successful</span>
        </h1>

        <p className="mt-4 text-slate-400">
          Your account has been created successfully.
          You can now sign in and start using your account.
        </p>

       
        <Link
          href="/signin"
          className="mt-8 inline-flex w-full justify-center rounded-xl bg-cyan-500 py-3 font-semibold text-slate-900 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
        >
          Go to Sign In
        </Link>

      </div>

    </div>
  );
}