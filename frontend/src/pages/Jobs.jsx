import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Fetch jobs from Adzuna API
async function fetchJobsAdzuna(query = "", location = "") {
  const APP_ID = "d461f071"; // replace with your App ID
  const APP_KEY = "de399d2305d9102cb5356bb5dbc7aa13"; // replace with your App Key

  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10&what=${encodeURIComponent(
    query
  )}&where=${encodeURIComponent(location)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  const data = await res.json();

  return data.results.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company?.display_name || "Not disclosed",
    location: job.location?.display_name || "Not specified",
    contract: job.contract_time || "N/A",
    salary: job.salary_min
      ? `₹${job.salary_min.toLocaleString()} - ₹${
          job.salary_max?.toLocaleString() || ""
        }`
      : "Not disclosed",
    applyUrl: job.redirect_url,
  }));
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchJobsAdzuna(q, loc);
      setJobs(res);
      if (res.length === 0) setToast("No jobs found. Try changing filters.");
    } catch (e) {
      setToast("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [q, loc]);

  useEffect(() => {
    load();
  }, [load]);

  // ✅ Handle Apply
  const handleApply = (url) => {
    const token = localStorage.getItem("token");
    if (token) {
      // logged in → open job apply link
      window.open(url, "_blank");
    } else {
      // not logged in → redirect to login
      setToast("⚠️ Please login to apply for jobs.");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0076BC] to-[#00A86B]">
      {/* Navbar */}
      <Navbar />

      <section className="max-w-6xl mx-auto py-14 px-6">
        {/* Search Card */}
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Find Your Dream Job
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <input
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0076BC] outline-none"
              placeholder="Job title (e.g., Sales, Data Entry)"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <input
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0076BC] outline-none"
              placeholder="Location (e.g., Delhi)"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={load}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Searching…" : "Search"}
            </button>
            <button
              onClick={() => {
                setQ("");
                setLoc("");
                setJobs([]);
              }}
              className="border px-6 py-3 rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Job Results */}
        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-[#0076BC] mb-1">
                  {job.title}
                </h3>
                <p className="text-gray-700 font-medium">{job.company}</p>
                <p className="text-sm text-gray-500 mt-1">{job.location}</p>
                <p className="text-sm text-gray-500">
                  Type: <span className="font-medium">{job.contract}</span>
                </p>
                <p className="text-gray-800 mt-2 font-semibold">{job.salary}</p>
                <button
                  onClick={() => handleApply(job.applyUrl)}
                  className="block mt-5 w-full bg-[#0076BC] text-white text-center py-2 rounded-lg hover:bg-[#005f94] transition"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white text-lg">
            Start searching to see available jobs.
          </p>
        )}
      </section>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-red-100 text-red-700 px-5 py-3 rounded-lg shadow-lg">
          {toast}{" "}
          <button className="ml-3 font-bold" onClick={() => setToast("")}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
