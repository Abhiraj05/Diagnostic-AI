"use client";

import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ReportAnalysisPage() {
  const [profile, setProfile] = useState({});
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getUserData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/auth/get-profile",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setProfile(response.data.user_profile_data);
    } catch (error) {
      console.log(error);
    }
  };

  const getReportData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/analysis/get-report",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );
      setReport(response.data.latest_report);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
    getReportData();
  }, []);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  if (loading) {
    return <Loader />;
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">Failed to load report.</p>
      </div>
    );
  }

  if (report.length == 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
            <svg
              className="h-8 w-8 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h4m-7 4h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-white">Upload a Report</h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">
            At least one medical report is required to generate your report
            analysis.
          </p>

          <div className="mx-auto mt-7 max-w-sm rounded-xl border border-slate-800 bg-slate-950 px-5 py-4">
            <p className="text-sm text-slate-500">Analysis requires</p>

            <p className="mt-1 text-sm font-medium text-cyan-400">
              At least 1 report
            </p>
          </div>

          <button
            onClick={() => router.push("/document-chat")}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-sm font-medium text-slate-300 transition hover:border-cyan-500/50 hover:bg-slate-700 hover:text-cyan-400"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const labResults = [
    {
      name: "Hemoglobin",
      value: report.hemoglobin,
      unit: "g/dL",
    },
    {
      name: "WBC Count",
      value: report.wbc_count,
      unit: "cells/µL",
    },
    {
      name: "Platelet Count",
      value: report.platelet_count,
      unit: "cells/µL",
    },
    {
      name: "Blood Sugar",
      value: report.blood_sugar,
      unit: "mg/dL",
    },
    {
      name: "HbA1c",
      value: report.hba1c,
      unit: "%",
    },
    {
      name: "Total Cholesterol",
      value: report.total_cholesterol,
      unit: "mg/dL",
    },
    {
      name: "HDL Cholesterol",
      value: report.hdl_cholesterol,
      unit: "mg/dL",
    },
    {
      name: "LDL Cholesterol",
      value: report.ldl_cholesterol,
      unit: "mg/dL",
    },
    {
      name: "Triglycerides",
      value: report.triglycerides,
      unit: "mg/dL",
    },
    {
      name: "Creatinine",
      value: report.creatinine,
      unit: "mg/dL",
    },
    {
      name: "eGFR",
      value: report.egfr,
      unit: "mL/min/1.73m²",
    },
    {
      name: "AST (SGOT)",
      value: report.ast_sgot,
      unit: "U/L",
    },
    {
      name: "ALT (SGPT)",
      value: report.alt_sgpt,
      unit: "U/L",
    },
    {
      name: "TSH",
      value: report.tsh,
      unit: "mIU/L",
    },
    {
      name: "Vitamin D",
      value: report.vitamin_d,
      unit: "ng/mL",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* HEADER */}
            <div className="mt-6 mb-8">
              <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
                Patient Details
              </span>

              <h1 className="mt-4 text-3xl font-bold">{profile.name}</h1>

              <p className="mt-2 text-slate-400">
                {profile.gender} • {profile.age} Years • Email ID:{" "}
                {profile.email}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-1">
              {/* PATIENT INFORMATION */}
              {/* <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Patient Information
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name</span>
                    <span>{profile.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Gender</span>
                    <span>{profile.gender}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Age</span>
                    <span>{profile.age} years</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Email</span>
                    <span>{profile.email}</span>
                  </div>
                </div>
              </div> */}

              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-4 text-2xl font-semibold text-cyan-400">
                  AI Summary
                </h2>

                <p className="leading-7 text-slate-400 text-justify">
                  {report.summary_text || "No summary available."}
                </p>
              </div>

              {/* SYMPTOMS */}
              {/* <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-semibold">Symptoms</h2>

                {report.symptoms?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {report.symptoms.map((item, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500">No symptoms available.</p>
                )}
              </div> */}

              {/* MEDICATIONS */}
              {/* <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-semibold">Medications</h2>

                {report.medications?.length > 0 ? (
                  <ul className="space-y-2 text-slate-300">
                    {report.medications.map((medicine, index) => (
                      <li key={index}>• {medicine}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">No medications available.</p>
                )}
              </div> */}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Lab Results</h2>

                <span className="text-sm text-slate-500">Latest Report</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">
                  <thead className="border-b border-slate-700 text-slate-400">
                    <tr>
                      <th className="py-3 text-left">Test</th>

                      <th className="py-3 text-center">Value</th>

                      <th className="py-3 text-center">Unit</th>
                    </tr>
                  </thead>

                  <tbody>
                    {labResults.map((lab, index) => (
                      <tr
                        key={lab.name}
                        className={
                          index !== labResults.length - 1
                            ? "border-b border-slate-800"
                            : ""
                        }
                      >
                        <td className="py-4 font-medium text-slate-200">
                          {lab.name}
                        </td>

                        <td className="py-4 text-center">
                          {lab.value !== null && lab.value !== undefined
                            ? lab.value
                            : "N/A"}
                        </td>

                        <td className="py-4 text-center text-slate-500">
                          {lab.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
