"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function PasswordResetSuccess() {
  return (
    <motion.div
      className="min-h-screen bg-slate-950 flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400/30"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
        >
          <motion.span
            className="text-5xl text-cyan-400"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.3 }}
          >
            ✓
          </motion.span>
        </motion.div>

        <motion.h1
          className="mt-8 text-3xl font-black text-white tracking-tight"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          Password
          <span className="text-cyan-400"> Updated</span>
        </motion.h1>

        <motion.p
          className="mt-4 text-slate-400"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
        >
          Your password has been changed successfully. You can now sign in using
          your new password.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <Link
            href="/signin"
            className="mt-8 inline-flex w-full justify-center rounded-xl bg-cyan-500 py-3 font-semibold text-slate-900 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
          >
            Go to Sign In
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
