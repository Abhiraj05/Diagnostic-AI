"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Document Chat", href: "/pdf-chat", icon: "description" },
    { name: "Report Comparison", href: "/comparison", icon: "compare_arrows" },
    { name: "Report Analysis", href: "/report-analysis", icon: "analytics" },
    { name: "Profile Settings", href: "/settings", icon: "settings" },
  ];

  return (
    <aside className="bg-slate-950 h-screen w-72 flex-col fixed left-0 top-0 border-r border-slate-800 hidden lg:flex z-50 text-white">
      {/* Sidebar Header */}
      <div className="p-8 h-20 flex flex-col justify-center border-b border-slate-800/50">
        <h1 className="text-2xl font-black tracking-tight">
          <Link href="/">
            Diagnostic <span className="text-cyan-400">AI</span>
          </Link>
        </h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "text-cyan-400 bg-cyan-500/10 font-bold border border-cyan-500/20 shadow-sm"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {link.icon}
              </span>
              <span className="text-base">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/"
        className="inline-flex items-center gap-2  border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-cyan-400 backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-slate-800 hover:text-cyan-300"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back to Home
      </Link>
      {/* Sidebar Footer */}
      <div className="p-6 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3 px-2">
          <img
            alt="J"
            className="w-11 h-11 rounded-full object-cover border-2 border-slate-800"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBztv2IJU4-1cntPgmqXxcoULrNsCkFU7LloDY-58Wjs-TgA2grO1U-qKpi3pneiauxT2G-SfVAz8946CLXu1EPM_iX9tqSa88U0wl1exltuG1lzeyp6dS09_lwHiN-I-veyYY6wXCvUxi5Veg6PCyhuhJHbk4sYJqyS8HJ5G53FSkucSGe_y8hwjfETDOFD-GQogeSCOX58S_qntKO7jBArNeza1BOo3sVY2VrDXHHuiYvXLEngrXET1yE9ZBeecL387R_qnnf8pMz"
          />
          <div className="overflow-hidden">
            <p className="font-bold text-base text-white truncate">John Doe</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
