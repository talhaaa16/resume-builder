import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";

async function fetchJobsAdzuna(query = "", location = "") {
  const APP_ID = process.env.REACT_APP_ADZUNA_ID;
  const APP_KEY = process.env.REACT_APP_ADZUNA_KEY;

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
      ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max?.toLocaleString() || ""
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
  const { showToast } = useToast();
  const navigate = useNavigate();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchJobsAdzuna(q, loc);
      setJobs(res);
      if (res.length === 0) showToast("No jobs found. Try changing filters.", "info");
    } catch (e) {
      showToast("Failed to load jobs", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleApply = (url) => {
    const token = localStorage.getItem("token");
    if (token) {
      window.open(url, "_blank");
    } else {
      showToast("Please login to apply for jobs.", "info");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0076BC] to-[#00A86B] flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <section className="max-w-6xl mx-auto py-14 px-6">
          <div className="bg-white shadow-lg rounded-2xl p-8 mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Find Your Dream Job
            </h2>
            <form onSubmit={(e) => { e.preventDefault(); load(); }}>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <input
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0076BC] outline-none text-gray-900"
                  placeholder="Job title (e.g., Sales, Data Entry)"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <input
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0076BC] outline-none text-gray-900"
                  placeholder="Location (e.g., Delhi)"
                  value={loc}
                  onChange={(e) => setLoc(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
                >
                  {loading ? "Searching…" : "Search"}
                </button>
                <button
                  type="button"
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
            </form>
          </div>

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
      </div>
      <Footer />
    </div>
  );
}
