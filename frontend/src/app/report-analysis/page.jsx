"use client";

import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import axios from "axios";
export default function ReportAnalysisPage() {
  const [profile, setProfile] = useState({});
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

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
