"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

// =====================================================
// GET LAB STATUS
// =====================================================

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

// =====================================================
// STATUS COLOR
// =====================================================

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

// =====================================================
// STATUS RANK
// Used to determine whether latest result improved
// or became worse compared with previous result.
// =====================================================

const getStatusRank = (status) => {
  if (status === "normal") return 3;
  if (status === "warning") return 2;
  if (status === "abnormal") return 1;

  return 0;
};

// =====================================================
// CHANGE COLOR
// =====================================================

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
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // FETCH REPORTS
  // =====================================================

  const getReportsData = async () => {
    try {
      // =================================================
      // REAL API - USE THIS LATER
      // =================================================

      /*
      const response = await axios.get(
        "http://127.0.0.1:8000/comparison/compare-reports"
      );

      setReports(response.data.reports);
      */

      // =================================================
      // DUMMY DATA
      // =================================================

      const dummyReports = [
        {
          report_type: "latest",
          upload_date: "2026-08-10",

          lab_results: {
            hemoglobin: 14.2,
            wbc_count: 7500,
            platelet_count: 250000,
            blood_sugar: 105,
            hba1c: 5.6,
            total_cholesterol: 190,
            hdl_cholesterol: 52,
            ldl_cholesterol: 112,
            triglycerides: 135,
            creatinine: 0.9,
            egfr: 96,
            ast_sgot: 25,
            alt_sgpt: 28,
            tsh: 2.4,
            vitamin_d: 32,
          },
        },

        {
          report_type: "previous",
          upload_date: "2026-07-20",

          lab_results: {
            hemoglobin: 13.4,
            wbc_count: 9200,
            platelet_count: 235000,
            blood_sugar: 118,
            hba1c: 5.9,
            total_cholesterol: 215,
            hdl_cholesterol: 48,
            ldl_cholesterol: 135,
            triglycerides: 175,
            creatinine: 1.1,
            egfr: 82,
            ast_sgot: 42,
            alt_sgpt: 46,
            tsh: 3.1,
            vitamin_d: 24,
          },
        },
      ];

      setReports(dummyReports);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReportsData();
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Loading report comparison...
        </p>
      </div>
    );
  }

  if (reports.length < 2) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-red-400">
          At least two reports are required for comparison.
        </p>
      </div>
    );
  }

  const latestReport = reports[0];
  const previousReport = reports[1];

  // =====================================================
  // PATIENT
  // =====================================================

  const patient = {
    name: "John Doe",
    age: 42,
    gender: "Male",
    patient_id: "PT-1023",
  };

  // =====================================================
  // LAB RESULTS
  // =====================================================

  const labResults = [
    {
      name: "Hemoglobin",
      latest: latestReport.lab_results.hemoglobin,
      previous: previousReport.lab_results.hemoglobin,
      unit: "g/dL",
      min: 13,
      max: 17,
    },

    {
      name: "WBC Count",
      latest: latestReport.lab_results.wbc_count,
      previous: previousReport.lab_results.wbc_count,
      unit: "cells/µL",
      min: 4000,
      max: 11000,
    },

    {
      name: "Platelet Count",
      latest: latestReport.lab_results.platelet_count,
      previous: previousReport.lab_results.platelet_count,
      unit: "cells/µL",
      min: 150000,
      max: 450000,
    },

    {
      name: "Blood Sugar",
      latest: latestReport.lab_results.blood_sugar,
      previous: previousReport.lab_results.blood_sugar,
      unit: "mg/dL",
      min: 70,
      max: 100,
    },

    {
      name: "HbA1c",
      latest: latestReport.lab_results.hba1c,
      previous: previousReport.lab_results.hba1c,
      unit: "%",
      min: 0,
      max: 5.7,
    },

    {
      name: "Total Cholesterol",
      latest: latestReport.lab_results.total_cholesterol,
      previous: previousReport.lab_results.total_cholesterol,
      unit: "mg/dL",
      min: 0,
      max: 200,
    },

    {
      name: "HDL Cholesterol",
      latest: latestReport.lab_results.hdl_cholesterol,
      previous: previousReport.lab_results.hdl_cholesterol,
      unit: "mg/dL",
      min: 40,
      max: 100,
    },

    {
      name: "LDL Cholesterol",
      latest: latestReport.lab_results.ldl_cholesterol,
      previous: previousReport.lab_results.ldl_cholesterol,
      unit: "mg/dL",
      min: 0,
      max: 100,
    },

    {
      name: "Triglycerides",
      latest: latestReport.lab_results.triglycerides,
      previous: previousReport.lab_results.triglycerides,
      unit: "mg/dL",
      min: 0,
      max: 150,
    },

    {
      name: "Creatinine",
      latest: latestReport.lab_results.creatinine,
      previous: previousReport.lab_results.creatinine,
      unit: "mg/dL",
      min: 0.6,
      max: 1.3,
    },

    {
      name: "eGFR",
      latest: latestReport.lab_results.egfr,
      previous: previousReport.lab_results.egfr,
      unit: "mL/min/1.73m²",
      min: 90,
      max: 120,
    },

    {
      name: "AST (SGOT)",
      latest: latestReport.lab_results.ast_sgot,
      previous: previousReport.lab_results.ast_sgot,
      unit: "U/L",
      min: 10,
      max: 40,
    },

    {
      name: "ALT (SGPT)",
      latest: latestReport.lab_results.alt_sgpt,
      previous: previousReport.lab_results.alt_sgpt,
      unit: "U/L",
      min: 7,
      max: 40,
    },

    {
      name: "TSH",
      latest: latestReport.lab_results.tsh,
      previous: previousReport.lab_results.tsh,
      unit: "mIU/L",
      min: 0.4,
      max: 4,
    },

    {
      name: "Vitamin D",
      latest: latestReport.lab_results.vitamin_d,
      previous: previousReport.lab_results.vitamin_d,
      unit: "ng/mL",
      min: 30,
      max: 100,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Sidebar />

      <main className="flex-1 lg:ml-72 flex flex-col">

        <div className="max-w-6xl mx-auto w-full p-8 mt-6">

          {/* HEADER */}

          <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300 mb-3">
            Report Comparison
          </span>

          <h1 className="text-4xl font-bold">
            Report Comparison
          </h1>

          <p className="text-slate-400 mt-2">
            Compare the patient's latest report with the previous report.
          </p>

          {/* PATIENT */}

          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">

            <h2 className="text-lg font-semibold mb-4">
              Patient
            </h2>

            <div className="grid md:grid-cols-4 gap-4">

              <div>
                <p className="text-sm text-slate-500">
                  Name
                </p>

                <p className="mt-1 font-medium">
                  {patient.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Gender
                </p>

                <p className="mt-1 font-medium">
                  {patient.gender}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Age
                </p>

                <p className="mt-1 font-medium">
                  {patient.age} years
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Patient ID
                </p>

                <p className="mt-1 font-medium">
                  {patient.patient_id}
                </p>
              </div>

            </div>

          </div>

          {/* REPORT CARDS */}

          <div className="grid md:grid-cols-2 gap-6 mt-6">

            <div className="rounded-2xl border border-cyan-500/30 bg-slate-900 p-6">

              <span className="text-sm text-cyan-400">
                Latest Report
              </span>

              <h2 className="text-xl font-semibold mt-2">
                Current Results
              </h2>

              <p className="text-slate-400 mt-2">
                {latestReport.upload_date}
              </p>

            </div>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

              <span className="text-sm text-slate-400">
                Previous Report
              </span>

              <h2 className="text-xl font-semibold mt-2">
                Previous Results
              </h2>

              <p className="text-slate-400 mt-2">
                {previousReport.upload_date}
              </p>

            </div>

          </div>

          {/* LEGEND */}

          <div className="mt-8 flex flex-wrap gap-6 text-sm">

            <span className="text-green-400">
              ● Improved / Normal
            </span>

            <span className="text-yellow-400">
              ● Attention
            </span>

            <span className="text-red-400">
              ● Worsened / Abnormal
            </span>

            <span className="text-slate-400">
              ● No status change
            </span>

          </div>

          {/* COMPARISON */}

          <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">

            <div className="border-b border-slate-700 px-6 py-4">

              <h2 className="text-lg font-semibold">
                Laboratory Comparison
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Latest report compared with previous report.
              </p>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-slate-800 text-slate-400">

                  <tr>

                    <th className="px-6 py-4 text-left">
                      Test
                    </th>

                    <th className="px-6 py-4 text-left">
                      Latest
                    </th>

                    <th className="px-6 py-4 text-left">
                      Previous
                    </th>

                    <th className="px-6 py-4 text-left">
                      Change
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {labResults.map((lab) => {

                    const latestStatus = getStatus(
                      lab.latest,
                      lab.min,
                      lab.max
                    );

                    const previousStatus = getStatus(
                      lab.previous,
                      lab.min,
                      lab.max
                    );

                    const change =
                      lab.latest - lab.previous;

                    const changeText =
                      change > 0
                        ? `+${change.toFixed(2)}`
                        : change.toFixed(2);

                    const changeColor = getChangeColor(
                      previousStatus,
                      latestStatus
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
                                latestStatus
                              )}`}
                            >
                              {lab.latest} {lab.unit}
                            </span>

                            <span
                              className={`text-xs mt-1 ${getStatusColor(
                                latestStatus
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
                                previousStatus
                              )}`}
                            >
                              {lab.previous} {lab.unit}
                            </span>

                            <span
                              className={`text-xs mt-1 ${getStatusColor(
                                previousStatus
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

                          <span
                            className={`font-semibold ${changeColor}`}
                          >
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
              AI Comparison Summary
            </h2>

            <p className="mt-3 text-slate-400 leading-7">
              The latest report has been compared with the
              patient's previous report. Changes in laboratory
              values are highlighted according to their current
              reference status. This comparison can help identify
              parameters that have improved, remained stable, or
              require further attention.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}