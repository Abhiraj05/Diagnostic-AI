import Link from "next/link";
import Sidebar from "@/components/Sidebar";
export default function Page() {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex">
      <Sidebar />
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <header className="bg-white sticky top-0 z-40 border-b border-gray-200 flex justify-between items-center h-16 px-8 w-full shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                data-icon="search"
              >
                search
              </span>
              <input
                className="bg-gray-100 border-none rounded-md pl-10 pr-4 py-2 w-80 text-sm focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                placeholder="Search Patient ID, Symptom..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 items-center bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100">
              <span
                className="material-symbols-outlined text-[18px]"
                data-icon="auto_awesome"
              >
                auto_awesome
              </span>
              <span className="text-sm font-medium">AI Engine: Online</span>
            </div>
          </div>
        </header>
        <div className="w-full flex-1">
          {/* Hero Section */}
          <section className="relative pt-24 pb-32 px-margin overflow-hidden">
            <div className="max-w-container-max mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <div className="z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm border border-teal-200 mb-6">
                  <span className="h-2 w-2 rounded-full bg-green-600 shadow-[0_0_8px_#4edea3]"></span>
                  <span className="text-xs font-medium uppercase tracking-wider text-green-600 uppercase tracking-widest">
                    Enterprise Intelligence Platform
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Transform Clinical Records Into{" "}
                  <span className="text-teal-600">AI-Powered</span> Medical
                  Intelligence
                </h1>
                <p className="text-lg text-gray-900-variant mb-10 max-w-xl">
                  Leverage semantic patient retrieval and structured extraction
                  to accelerate clinical research and improve patient outcomes
                  through high-fidelity data synthesis.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-lg shadow-[0_0_20px_rgba(137,206,255,0.3)] hover:scale-[1.02] transition-transform active:scale-95">
                    Launch Dashboard
                  </button>
                  <button className="px-8 py-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-gray-900 border border-gray-200 hover:bg-slate-50-container-high transition-colors font-bold rounded-lg">
                    Upload Reports
                  </button>
                </div>
                <div className="mt-12 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    <img
                      className="h-10 w-10 rounded-full border-2 border-surface"
                      data-alt="A male surgeon in his 40s looking confident in a blue clinical environment with medical technology in the background."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX-Y_jVLdBDdGXfPp7-CpaI01dZQX6ee7OR9NQuUrOv2NEiTpczVMWBlYLVWCnNZerE6oMiv08GFJ7OOeWaU4FJXtKbVhvG7wJkPtbPIyoQptqwbihqPzRrz_Ye3J1GbaAlWcoe9Cs2wMLp_PBEJx0kHQEsgluEE2cI2l1W2rQ5qdXQ2q9rnonDnvG65Gp47kjZX7GYFf3eDFQi7dgHUs7xTw0-v7y4ln-MXPSGpBA8aZgSXhBxpupW-CptgbDIkLX2uANRk26TXq1"
                    />
                    <img
                      className="h-10 w-10 rounded-full border-2 border-surface"
                      data-alt="A professional female researcher in a lab setting with soft lighting and clinical equipment in the background."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAPGZtcYJeTuFU9GeiMYcSNYh3yZVUE7Z3dMeh9L0vMjS3tETtv87mAMOQANFXkBKQgq3GM108IH04UqF6cRiuE36gSs0OqdnoQ4rGF3Ghm0kwXhVkDlqoLT_py9xUlB9vNG7yrYDQFeYaQ1j_2u5rjxY9zGBSK3DyTctKlDbuhGb2sbPRZmdPsh42G7ccEts40aQ-lCvX6FflVOEGAxEngCBT_1_BYWJO-70TcbnahOenFyeNg0djEu0vIAzojOCxtqAXfR7-Sovq"
                    />
                    <div className="h-10 w-10 rounded-full border-2 border-surface bg-slate-50-container-highest flex items-center justify-center ">
                      +40
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900-variant">
                    Trusted by 250+ Clinical Institutes
                  </p>
                </div>
              </div>
              <div className="relative">
                {/* Glassmorphism Mockup */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm p-6 rounded-xl shadow-2xl relative z-10 ai-shimmer-border">
                  <img
                    alt="Dashboard Preview"
                    className="rounded-lg opacity-90"
                    data-alt="A sleek, futuristic clinical research dashboard showing complex data visualizations, heatmaps, and patient connectivity graphs. The UI features a slate theme with vibrant cyan and emerald accents. Floating glass cards show medical entities and clinical metrics with soft glowing pulses. The atmosphere is highly technical, clean, and advanced, representing a next-generation medical software interface."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoBBdOwT06O8QfbCxmcPsp8apkJK0LqaBKw8CjX4EEjmFWspye76WMla_JWyi2ESkvXKCtghqNrA84yG-BJIOyVwh-u_Rgfo6NbbBXjmCWIi14zXQbMva8cHjODpyWkUGNX76ayQQdivopvWB5HoRRzoqALAFZBJ4SuTtY0fVnsbKehN2iflp4FvceqssYDhCtdLcKexgm9HOUpyLx-9AzJ4o9nhLpq9FjJx4q2_EEyDGlArutF2Z3xAli5UpfAHCdx5G6VtdseaqB"
                  />
                  {/* Floating Medical AI Cards */}
                  <div className="absolute -top-10 -right-10 bg-white p-6 rounded-xl border border-gray-200 shadow-sm p-4 rounded-lg border-teal-200 w-56 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="material-symbols-outlined text-teal-600"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        psychology
                      </span>
                      <span className="text-sm font-medium font-bold">
                        AI Synthesis
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-1.5 w-full bg-slate-50-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 w-3/4"></div>
                      </div>
                      <p className="text-[10px] text-gray-900-variant font-mono">
                        EXTRACTING: ONCOLOGY_PATH_04
                      </p>
                    </div>
                  </div>
                </div>
                {/* Background decor */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-600/5 blur-[120px] rounded-full"></div>
              </div>
            </div>
          </section>
          {/* Stats Section */}
          <section className="bg-slate-50-container-lowest py-20 px-margin">
            <div className="max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  500K+
                </div>
                <div className="text-xs font-medium uppercase tracking-wider uppercase tracking-widest text-gray-900-variant">
                  Medical Reports
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  92%
                </div>
                <div className="text-xs font-medium uppercase tracking-wider uppercase tracking-widest text-gray-900-variant">
                  Extraction Accuracy
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">70%</div>
                <div className="text-xs font-medium uppercase tracking-wider uppercase tracking-widest text-gray-900-variant">
                  Faster Analysis
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  120K+
                </div>
                <div className="text-xs font-medium uppercase tracking-wider uppercase tracking-widest text-gray-900-variant">
                  Complex Cases
                </div>
              </div>
            </div>
          </section>
          {/* Features Bento Grid */}
          <section className="py-32 px-margin">
            <div className="max-w-container-max mx-auto">
              <div className="mb-20 text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Advanced Clinical Capabilities
                </h2>
                <p className="text-lg text-gray-900-variant">
                  Unlock the latent intelligence buried in unstructured medical
                  data with our specialized clinical AI engine.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Feature 1: AI Structured Extraction */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm p-8 rounded-xl flex flex-col justify-between overflow-hidden group">
                  <div>
                    <div className="h-12 w-12 rounded-lg bg-teal-600/10 flex items-center justify-center mb-6 text-teal-600">
                      <span
                        className="material-symbols-outlined text-3xl"
                        data-icon="upload_file"
                      >
                        upload_file
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      AI Structured Extraction
                    </h3>
                    <p className="text-sm text-gray-900-variant max-w-lg">
                      Automatically convert messy PDFs, handwritten notes, and
                      scanned images into clean, standardized medical records
                      with validated entity mapping.
                    </p>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <span className="px-3 py-1 rounded bg-slate-50-container-highest font-mono text-teal-600 border border-teal-200">
                      OCR Engine v4.2
                    </span>
                    <span className="px-3 py-1 rounded bg-slate-50-container-highest font-mono text-green-600 border border-tertiary/20">
                      Entity Normalization
                    </span>
                  </div>
                </div>
                {/* Feature 2: Semantic Patient Search */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm p-8 rounded-xl flex flex-col group border-primary/10">
                  <div className="h-12 w-12 rounded-lg bg-teal-600/10 flex items-center justify-center mb-6 text-teal-600">
                    <span
                      className="material-symbols-outlined text-3xl"
                      data-icon="person_search"
                    >
                      person_search
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-4">
                    Semantic Search
                  </h3>
                  <p className="text-xs text-gray-900-variant">
                    Search by symptoms and patterns rather than just keywords.
                    Find relevant cohorts across millions of records instantly.
                  </p>
                </div>
                {/* Feature 3: Similar Case Retrieval */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm p-8 rounded-xl border-secondary/10">
                  <div className="h-12 w-12 rounded-lg bg-blue-600/10 flex items-center justify-center mb-6 text-blue-600">
                    <span
                      className="material-symbols-outlined text-3xl"
                      data-icon="compare_arrows"
                    >
                      compare_arrows
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-4">Case Retrieval</h3>
                  <p className="text-xs text-gray-900-variant">
                    Automatically surface clinically similar cases based on
                    multidimensional patient embeddings for comparative
                    research.
                  </p>
                </div>
                {/* Feature 4: Clinical Analytics */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm p-8 rounded-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1">
                    <div className="h-12 w-12 rounded-lg bg-green-600/10 flex items-center justify-center mb-6 text-green-600">
                      <span
                        className="material-symbols-outlined text-3xl"
                        data-icon="analytics"
                      >
                        analytics
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-4">
                      Deep Clinical Analytics
                    </h3>
                    <p className="text-sm text-gray-900-variant">
                      Visualize trend lines, medication efficacy, and
                      longitudinal patient health outcomes through high-density
                      interactive reports.
                    </p>
                  </div>
                  <div className="w-full md:w-64 aspect-square bg-slate-50-container-highest/50 rounded-lg border border-gray-200 p-4 flex items-end gap-2">
                    <div className="flex-1 bg-green-600/40 h-[60%] rounded-t"></div>
                    <div className="flex-1 bg-green-600/60 h-[80%] rounded-t"></div>
                    <div className="flex-1 bg-green-600/30 h-[40%] rounded-t"></div>
                    <div className="flex-1 bg-green-600/90 h-[100%] rounded-t"></div>
                    <div className="flex-1 bg-green-600/50 h-[70%] rounded-t"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Architecture Flow */}
          <section className="bg-slate-50-dim py-32 px-margin border-y border-gray-200">
            <div className="max-w-container-max mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Precision Data Architecture
              </h2>
              <p className="text-lg text-gray-900-variant mb-20 max-w-2xl mx-auto">
                From raw clinical documents to actionable medical insights in
                milliseconds.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 bg-white p-6 rounded-xl border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-teal-600 border-teal-200">
                    <span
                      className="material-symbols-outlined text-2xl"
                      data-icon="picture_as_pdf"
                    >
                      picture_as_pdf
                    </span>
                  </div>
                  <span className="text-sm font-medium ">PDF Upload</span>
                </div>
                <div className="hidden md:flex justify-center text-outline-variant">
                  <span className="material-symbols-outlined">
                    trending_flat
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 bg-white p-6 rounded-xl border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-blue-600 border-secondary/30">
                    <span
                      className="material-symbols-outlined text-2xl"
                      data-icon="description"
                    >
                      description
                    </span>
                  </div>
                  <span className="text-sm font-medium ">
                    OCR &amp; Extraction
                  </span>
                </div>
                <div className="hidden md:flex justify-center text-outline-variant">
                  <span className="material-symbols-outlined">
                    trending_flat
                  </span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="h-16 w-16 bg-white p-6 rounded-xl border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-green-600 border-tertiary/30">
                    <span
                      className="material-symbols-outlined text-2xl"
                      data-icon="hub"
                    >
                      hub
                    </span>
                  </div>
                  <span className="text-sm font-medium ">Knowledge Graph</span>
                </div>
                <div className="flex flex-col items-center gap-4 md:col-span-1 col-span-2 mt-8 md:mt-0">
                  <div className="px-6 py-4 bg-teal-600 text-white rounded-lg font-bold">
                    AI INSIGHTS
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* CTA Section */}
          <section className="py-32 px-margin relative overflow-hidden">
            <div className="max-w-container-max mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm p-16 rounded-3xl text-center relative z-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Ready to accelerate your clinical research?
              </h2>
              <p className="text-lg text-gray-900-variant mb-12 max-w-2xl mx-auto">
                Join the world&apos;s leading research institutions using
                PatientGraph AI to decode the complexity of medical records.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button className="px-12 py-5 bg-teal-600 text-white font-bold rounded-xl shadow-xl hover:shadow-primary/20 transition-all">
                  Get Started Now
                </button>
                <button className="px-12 py-5 border border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-slate-50-container-high transition-all">
                  Schedule a Demo
                </button>
              </div>
            </div>
            {/* Decorative light blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-600/10 blur-[100px] -z-10 rounded-full"></div>
          </section>
        </div>
      </main>
    </div>
  );
}
