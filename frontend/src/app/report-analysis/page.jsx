"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";

export default function ReportAnalysisPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const getReportData = async () => {
    try {
      // =====================================================
      // REAL API FETCH - USE THIS LATER
      // =====================================================

      // const response = await axios.get(
      //   "http://127.0.0.1:8000/report-analysis"
      // );

      // setReport(response.data);

      // =====================================================
      // TEMPORARY DUMMY DATA
      // =====================================================

      await new Promise((resolve) => setTimeout(resolve, 800));

      const dummyData = {
        patient: {
          name: "John Doe",
          age: 42,
          gender: "Male",
          patient_id: 1023,
          email: "john.doe@example.com",
        },

        summary:
          "The patient shows generally stable laboratory results. Blood parameters are within acceptable ranges. Continued monitoring is recommended.",

        symptoms: [
          "Fatigue",
          "Mild headache",
          "Occasional dizziness",
        ],

        medications: [
          "Paracetamol 650mg",
          "Vitamin D3 1000 IU",
        ],

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
      };

      setReport(dummyData);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReportData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading report...</p>
      </div>
    );
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
      value: report.lab_results?.hemoglobin,
      unit: "g/dL",
    },
    {
      name: "WBC Count",
      value: report.lab_results?.wbc_count,
      unit: "cells/µL",
    },
    {
      name: "Platelet Count",
      value: report.lab_results?.platelet_count,
      unit: "cells/µL",
    },
    {
      name: "Blood Sugar",
      value: report.lab_results?.blood_sugar,
      unit: "mg/dL",
    },
    {
      name: "HbA1c",
      value: report.lab_results?.hba1c,
      unit: "%",
    },
    {
      name: "Total Cholesterol",
      value: report.lab_results?.total_cholesterol,
      unit: "mg/dL",
    },
    {
      name: "HDL Cholesterol",
      value: report.lab_results?.hdl_cholesterol,
      unit: "mg/dL",
    },
    {
      name: "LDL Cholesterol",
      value: report.lab_results?.ldl_cholesterol,
      unit: "mg/dL",
    },
    {
      name: "Triglycerides",
      value: report.lab_results?.triglycerides,
      unit: "mg/dL",
    },
    {
      name: "Creatinine",
      value: report.lab_results?.creatinine,
      unit: "mg/dL",
    },
    {
      name: "eGFR",
      value: report.lab_results?.egfr,
      unit: "mL/min/1.73m²",
    },
    {
      name: "AST (SGOT)",
      value: report.lab_results?.ast_sgot,
      unit: "U/L",
    },
    {
      name: "ALT (SGPT)",
      value: report.lab_results?.alt_sgpt,
      unit: "U/L",
    },
    {
      name: "TSH",
      value: report.lab_results?.tsh,
      unit: "mIU/L",
    },
    {
      name: "Vitamin D",
      value: report.lab_results?.vitamin_d,
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

              <h1 className="mt-4 text-3xl font-bold">
                {report.patient?.name}
              </h1>

              <p className="mt-2 text-slate-400">
                {report.patient?.gender} • {report.patient?.age} Years •
                Patient ID: {report.patient?.patient_id}
              </p>
            </div>

            {/* PATIENT + SUMMARY */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* PATIENT INFORMATION */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Patient Information
                </h2>

                <div className="space-y-3">

                  <div className="flex justify-between">
                    <span className="text-slate-400">Name</span>
                    <span>{report.patient?.name}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Gender</span>
                    <span>{report.patient?.gender}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Age</span>
                    <span>{report.patient?.age} years</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Patient ID</span>
                    <span>{report.patient?.patient_id}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-400">Email</span>
                    <span>{report.patient?.email}</span>
                  </div>

                </div>
              </div>

              {/* AI SUMMARY */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-semibold text-cyan-400">
                  AI Summary
                </h2>

                <p className="leading-7 text-slate-400">
                  {report.summary || "No summary available."}
                </p>
              </div>

              {/* SYMPTOMS */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Symptoms
                </h2>

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
                  <p className="text-slate-500">
                    No symptoms available.
                  </p>
                )}
              </div>

              {/* MEDICATIONS */}
              <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Medications
                </h2>

                {report.medications?.length > 0 ? (
                  <ul className="space-y-2 text-slate-300">
                    {report.medications.map((medicine, index) => (
                      <li key={index}>• {medicine}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500">
                    No medications available.
                  </p>
                )}
              </div>
            </div>

            {/* LAB RESULTS */}
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900 p-6">

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Lab Results
                </h2>

                <span className="text-sm text-slate-500">
                  Latest Report
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-300">

                  <thead className="border-b border-slate-700 text-slate-400">
                    <tr>
                      <th className="py-3 text-left">
                        Test
                      </th>

                      <th className="py-3 text-center">
                        Value
                      </th>

                      <th className="py-3 text-center">
                        Unit
                      </th>
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
                          {lab.value !== null &&
                          lab.value !== undefined
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