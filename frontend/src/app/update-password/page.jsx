"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.password) {
      alert("please enter your new password !");
      return;
    }

    if (!confirmPassword) {
      alert("please confirm your new password !");
      return;
    }

    if (formData.password.length < 8) {
      alert("password length should be minimum 8 characters !");
      return;
    }

    if (formData.password && confirmPassword) {
      alert("password doesn't match !");
      return;
    }
    try {
      const email = localStorage.getItem("email");
      const response = await axios.post(
        "http://127.0.0.1:8000/update-password",
        {
          email: email,
          password: formData.password,
        },
      );
      localStorage.removeItem("email");
      alert(response.data.message);
      router.push("/password-reset-success");
      return;
    } catch (error) {
      console.log(error);
      alert("failed to update new password !");
      return;
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Reset
            <span className="text-cyan-400"> Password</span>
          </h1>

          <p className="mt-3 text-slate-400">
            Create a new password for your account.
          </p>
        </div>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              New Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Confirm password"
              name="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show"
              onChange={() => setShowPassword(!showPassword)}
            />

            <label htmlFor="show" className="text-sm text-slate-400">
              Show Password
            </label>
          </div>

          <button className="w-full rounded-xl bg-cyan-500 py-3 font-semibold text-slate-900 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20">
            Reset Password
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/signin" className="text-cyan-400 hover:text-cyan-300">
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
