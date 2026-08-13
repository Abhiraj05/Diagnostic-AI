"use client";

import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const getStatus = (value, min, max) => {
  if (value === null || value === undefined) {
    return "unknown";
  }

  if (value >= min && value <= max) {
    return "normal";
  }

  const range = max - min;

  const warningMin = min - range * 0.1;
  const warningMax = max + range * 0.1;

  if (value >= warningMin && value <= warningMax) {
    return "warning";
  }

  return "abnormal";
};

const getStatusColor = (status) => {
  if (status === "normal") {
    return "text-green-400";
  }

  if (status === "warning") {
    return "text-yellow-400";
  }

  if (status === "abnormal") {
    return "text-red-400";
  }

  return "text-slate-400";
};

const getStatusRank = (status) => {
  if (status === "normal") return 3;
  if (status === "warning") return 2;
  if (status === "abnormal") return 1;

  return 0;
};

const getChangeColor = (previousStatus, latestStatus) => {
  const previousRank = getStatusRank(previousStatus);
  const latestRank = getStatusRank(latestStatus);

  if (latestRank > previousRank) {
    return "text-green-400";
  }

  if (latestRank < previousRank) {
    return "text-red-400";
  }

  if (latestStatus === "warning") {
    return "text-yellow-400";
  }

  return "text-slate-400";
};

export default function ReportComparisonPage() {
  const [profile, setProfile] = useState([]);
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState("Not Available");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getReportsData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/comparison/get-reports",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        },
      );

      setReports(response.data.latest_reports);
      setSummary(response.data.comparison_summary);
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    getUserData();
    getReportsData();
  }, []);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  if (loading) {
    return <Loader />;
  }

  if (reports.length < 2) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
            <svg
              className="h-7 w-7 text-cyan-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a2.25 2.25 0 0 0 2.25 2.25h1.5A2.25 2.25 0 0 0 15 18.257V17.25m-6-8.25h6m-6 3h6m-7.5 6.75h9A2.25 2.25 0 0 0 18.75 16.5V6.75A2.25 2.25 0 0 0 16.5 4.5h-9a2.25 2.25 0 0 0-2.25 2.25v9.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-white">
            Not Enough Reports
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            At least two medical reports are required to compare your results.
          </p>
          <button
            onClick={() => router.push("/document-chat")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-500/50 hover:bg-slate-700 hover:text-cyan-400"
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
  const latestReport = reports[0];
  const previousReport = reports[1];

  const patient = {
    name: profile.name,
    email: profile.email,
    gender: profile.gender,
    age: profile.age,
  };

  const labResults = [
    {
      name: "Hemoglobin",
      latest: latestReport.hemoglobin,
      previous: previousReport.hemoglobin,
      unit: "g/dL",
      min: 13,
      max: 17,
    },

    {
      name: "WBC Count",
      latest: latestReport.wbc_count,
      previous: previousReport.wbc_count,
      unit: "cells/µL",
      min: 4000,
      max: 11000,
    },

    {
      name: "Platelet Count",
      latest: latestReport.platelet_count,
      previous: previousReport.platelet_count,
      unit: "cells/µL",
      min: 150000,
      max: 450000,
    },

    {
      name: "Blood Sugar",
      latest: latestReport.blood_sugar,
      previous: previousReport.blood_sugar,
      unit: "mg/dL",
      min: 70,
      max: 100,
    },

    {
      name: "HbA1c",
      latest: latestReport.hba1c,
      previous: previousReport.hba1c,
      unit: "%",
      min: 0,
      max: 5.7,
    },

    {
      name: "Total Cholesterol",
      latest: latestReport.total_cholesterol,
      previous: previousReport.total_cholesterol,
      unit: "mg/dL",
      min: 0,
      max: 200,
    },

    {
      name: "HDL Cholesterol",
      latest: latestReport.hdl_cholesterol,
      previous: previousReport.hdl_cholesterol,
      unit: "mg/dL",
      min: 40,
      max: 100,
    },

    {
      name: "LDL Cholesterol",
      latest: latestReport.ldl_cholesterol,
      previous: previousReport.ldl_cholesterol,
      unit: "mg/dL",
      min: 0,
      max: 100,
    },

    {
      name: "Triglycerides",
      latest: latestReport.triglycerides,
      previous: previousReport.triglycerides,
      unit: "mg/dL",
      min: 0,
      max: 150,
    },

    {
      name: "Creatinine",
      latest: latestReport.creatinine,
      previous: previousReport.creatinine,
      unit: "mg/dL",
      min: 0.6,
      max: 1.3,
    },

    {
      name: "eGFR",
      latest: latestReport.egfr,
      previous: previousReport.egfr,
      unit: "mL/min/1.73m²",
      min: 90,
      max: 120,
    },

    {
      name: "AST (SGOT)",
      latest: latestReport.ast_sgot,
      previous: previousReport.ast_sgot,
      unit: "U/L",
      min: 10,
      max: 40,
    },

    {
      name: "ALT (SGPT)",
      latest: latestReport.alt_sgpt,
      previous: previousReport.alt_sgpt,
      unit: "U/L",
      min: 7,
      max: 40,
    },

    {
      name: "TSH",
      latest: latestReport.tsh,
      previous: previousReport.tsh,
      unit: "mIU/L",
      min: 0.4,
      max: 4,
    },

    {
      name: "Vitamin D",
      latest: latestReport.vitamin_d,
      previous: previousReport.vitamin_d,
      unit: "ng/mL",
      min: 30,
      max: 100,
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <main className="flex-1 lg:ml-72 flex flex-col">
          <div className="max-w-6xl mx-auto w-full p-8 mt-6">
            {/* HEADER */}

            <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300 mb-3">
              Report Comparison
            </span>

            <h1 className="text-4xl font-bold">Report Comparison</h1>

            <p className="text-slate-400 mt-2">
              Compare the patient's latest report with the previous report.
            </p>

            {/* PATIENT */}

            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold mb-4 text-cyan-400">
                Patient
              </h2>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Name</p>

                  <p className="mt-1 font-medium">{patient.name}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 ">Gender</p>

                  <p className="mt-1 font-medium capitalize">
                    {patient.gender}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Age</p>

                  <p className="mt-1 font-medium">{patient.age} years</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Patient ID</p>

                  <p className="mt-1 font-medium">{patient.email}</p>
                </div>
              </div>
            </div>

            {/* REPORT CARDS */}

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">
                <span className="text-lg text-cyan-400">Latest Report</span>
                <p className="text-slate-400 mt-2">
                  File Name :{" "}
                  <span className="text-slate-100">
                    {latestReport.file_name}
                  </span>
                </p>

                <p className="text-slate-400 mt-2">
                  Upload Date :{" "}
                  <span className="text-slate-100">
                    {latestReport.upload_date}
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">
                <span className="text-lg text-cyan-400">Previous Report</span>
                <p className="text-slate-400 mt-2">
                  File Name :{" "}
                  <span className="text-slate-100">
                    {previousReport.file_name}
                  </span>
                </p>

                <p className="text-slate-400 mt-2">
                  Upload Date :{" "}
                  <span className="text-slate-100">
                    {previousReport.upload_date}
                  </span>
                </p>
              </div>
            </div>

            {/* LEGEND */}

            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <span className="text-green-400">● Improved / Normal</span>

              <span className="text-yellow-400">● Attention</span>

              <span className="text-red-400">● Worsened / Abnormal</span>

              <span className="text-slate-400">● No status change</span>
            </div>

            {/* COMPARISON */}

            <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">
              <div className="border-b border-slate-700 px-6 py-4">
                <h2 className="text-lg font-semibold">Report Comparison</h2>

                <p className="text-sm text-slate-500 mt-1">
                  Latest report compared with previous report.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800 text-slate-400">
                    <tr>
                      <th className="px-6 py-4 text-left">Test</th>

                      <th className="px-6 py-4 text-left">Latest</th>

                      <th className="px-6 py-4 text-left">Previous</th>

                      <th className="px-6 py-4 text-left">Change</th>
                    </tr>
                  </thead>

                  <tbody>
                    {labResults.map((lab) => {
                      const latestStatus = getStatus(
                        lab.latest,
                        lab.min,
                        lab.max,
                      );

                      const previousStatus = getStatus(
                        lab.previous,
                        lab.min,
                        lab.max,
                      );

                      const change = lab.latest - lab.previous;

                      const changeText =
                        change > 0
                          ? `+${change.toFixed(2)}`
                          : change.toFixed(2);

                      const changeColor = getChangeColor(
                        previousStatus,
                        latestStatus,
                      );

                      return (
                        <tr
                          key={lab.name}
                          className="border-t border-slate-700"
                        >
                          {/* TEST */}

                          <td className="px-6 py-4 font-medium text-slate-300">
                            {lab.name}
                          </td>

                          {/* LATEST */}

                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span
                                className={`font-semibold ${getStatusColor(
                                  latestStatus,
                                )}`}
                              >
                                {lab.latest} {lab.unit}
                              </span>

                              <span
                                className={`text-xs mt-1 ${getStatusColor(
                                  latestStatus,
                                )}`}
                              >
                                {latestStatus === "normal"
                                  ? "Normal"
                                  : latestStatus === "warning"
                                    ? "Attention"
                                    : "Abnormal"}
                              </span>
                            </div>
                          </td>

                          {/* PREVIOUS */}

                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span
                                className={`font-semibold ${getStatusColor(
                                  previousStatus,
                                )}`}
                              >
                                {lab.previous} {lab.unit}
                              </span>

                              <span
                                className={`text-xs mt-1 ${getStatusColor(
                                  previousStatus,
                                )}`}
                              >
                                {previousStatus === "normal"
                                  ? "Normal"
                                  : previousStatus === "warning"
                                    ? "Attention"
                                    : "Abnormal"}
                              </span>
                            </div>
                          </td>

                          {/* CHANGE */}

                          <td className="px-6 py-4">
                            <span className={`font-semibold ${changeColor}`}>
                              {changeText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI SUMMARY */}

            <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-cyan-400">
                AI Generated Comparison Summary
              </h2>

              <p className="mt-3 text-slate-400 leading-7">{summary}</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
