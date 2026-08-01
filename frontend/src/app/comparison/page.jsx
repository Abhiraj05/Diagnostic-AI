"use client";
import Sidebar from "@/components/Sidebar";

const patients = [
  {
    id: "PAT-8821",
    name: "Subject A",
    diagnosis: "Respiratory Infection",
    similarity: "94%",
  },
  {
    id: "PAT-4902",
    name: "Subject B",
    diagnosis: "Viral Pneumonia",
    similarity: "88%",
  },
];

export default function ReportComparisonPage() {
  const [latestReports, setLatestReports] = useState([]);

  const getReportsData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/get-latest-reports");
      setLatestReports(response.data.latest_reports);
    } catch (error) {
      console.log(error);
      // alert("failed to fetch reports history !")
      return;
    }
  };
  useEffect(() => {
    getReportsData();
  }, []);
  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      <Sidebar />

      <main className="flex-1 lg:ml-72 flex flex-col">
        <div className="max-w-6xl mx-auto w-full p-8 mt-6">
          <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300 mb-3">
            Patient Details
          </span>
          <h1 className="text-4xl font-bold">Patient Comparison</h1>
          <p className="text-slate-400 mt-2">
            Compare two patients using AI generated insights.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {patients.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
              >
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-slate-400 mt-1">{p.id}</p>

                <div className="mt-5 space-y-2">
                  <p>
                    <span className="text-cyan-400">Diagnosis:</span>{" "}
                    {p.diagnosis}
                  </p>
                  <p>
                    <span className="text-cyan-400">Similarity:</span>{" "}
                    {p.similarity}
                  </p>
                </div>

                <button className="mt-6 rounded-xl bg-cyan-500 px-5 py-2 font-semibold text-slate-900 hover:bg-cyan-400">
                  View Details
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden">
            <div className="border-b border-slate-700 px-6 py-4">
              <h2 className="text-lg font-semibold">Comparison</h2>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-slate-800 text-slate-400">
                <tr>
                  <th className="px-6 py-3 text-left">Metric</th>
                  <th className="px-6 py-3 text-left">Subject A</th>
                  <th className="px-6 py-3 text-left">Subject B</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-700">
                  <td className="px-6 py-4">Age</td>
                  <td className="px-6 py-4">42</td>
                  <td className="px-6 py-4">45</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="px-6 py-4">Recovery</td>
                  <td className="px-6 py-4 text-green-400">78%</td>
                  <td className="px-6 py-4 text-yellow-400">42%</td>
                </tr>
                <tr className="border-t border-slate-700">
                  <td className="px-6 py-4">Risk</td>
                  <td className="px-6 py-4">Low</td>
                  <td className="px-6 py-4">High</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-cyan-400">AI Summary</h2>
            <p className="mt-3 text-slate-400 leading-7">
              Subject A is responding better to treatment while Subject B
              requires closer monitoring. Overall similarity between both cases
              is high.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
