import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  BadgeDollarSign,
  ExternalLink,
  X,
  Loader2,
  FileSearch,
  Sparkles,
} from "lucide-react";
import axios from "axios";

async function fetchJobsAdzuna(query = "", location = "") {
  const APP_ID = process.env.REACT_APP_ADZUNA_ID;
  const APP_KEY = process.env.REACT_APP_ADZUNA_KEY;

  const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=12&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  const data = await res.json();

  return data.results.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company?.display_name || "Not disclosed",
    location: job.location?.display_name || "Not specified",
    contract: job.contract_time || null,
    salary: job.salary_min
      ? `₹${Math.round(job.salary_min).toLocaleString()} – ₹${Math.round(job.salary_max || job.salary_min).toLocaleString()}`
      : null,
    description: job.description
      ? job.description.replace(/<[^>]+>/g, "").slice(0, 130) + "…"
      : "",
    applyUrl: job.redirect_url,
    category: job.category?.label || "",
  }));
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-200" />
        <div className="w-20 h-5 rounded-full bg-slate-200" />
      </div>
      <div className="h-5 bg-slate-200 rounded-lg w-3/4 mb-2" />
      <div className="h-4 bg-slate-100 rounded-lg w-1/2 mb-4" />
      <div className="space-y-2 mb-5">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
      </div>
      <div className="flex gap-2 mb-5">
        <div className="h-5 w-20 rounded-full bg-slate-200" />
        <div className="h-5 w-24 rounded-full bg-slate-200" />
      </div>
      <div className="h-10 bg-slate-200 rounded-xl w-full" />
    </div>
  );
}

const CONTRACT_LABELS = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
};

const CONTRACT_COLORS = {
  full_time: "bg-green-50 text-green-700 border-green-200",
  part_time: "bg-yellow-50 text-yellow-700 border-yellow-200",
  contract: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [matchScores, setMatchScores] = useState({});
  const { showToast } = useToast();
  const navigate = useNavigate();

  const load = async (searchQ = q, searchLoc = loc) => {
    try {
      setLoading(true);
      setHasSearched(true);
      const res = await fetchJobsAdzuna(searchQ, searchLoc);
      setJobs(res);
      if (res.length === 0) showToast("No jobs found. Try different keywords.", "info");
    } catch (e) {
      showToast("Failed to load jobs. Check your connection.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckMatch = async (job) => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("uname");
      localStorage.removeItem("uemail");
      localStorage.removeItem("uprofilepic");
      showToast("Please login to check AI Match Score.", "info");
      navigate("/login");
      return;
    }
    setMatchScores(prev => ({ ...prev, [job.id]: { loading: true } }));
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || ""}/api/ai/job-match`,
        { jobTitle: job.title, jobDescription: job.description || job.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.sts === 0) {
        setMatchScores(prev => ({ ...prev, [job.id]: { loading: false, data: res.data.analysis } }));
      } else {
        showToast(res.data.msg, "error");
        setMatchScores(prev => ({ ...prev, [job.id]: { loading: false } }));
      }
    } catch (error) {
      showToast(error.response?.data?.msg || "Failed to calculate match score", "error");
      setMatchScores(prev => ({ ...prev, [job.id]: { loading: false } }));
    }
  };

  const handleApply = (url) => {
    const token = localStorage.getItem("token");
    if (token) {
      window.open(url, "_blank");
    } else {
      localStorage.removeItem("uname");
      localStorage.removeItem("uemail");
      localStorage.removeItem("uprofilepic");
      showToast("Please login to apply for jobs.", "info");
      navigate("/login");
    }
  };

  const handleClear = () => {
    setQ("");
    setLoc("");
    setJobs([]);
    setHasSearched(false);
  };

  const quickSearches = ["Software Developer", "Sales Executive", "Data Entry", "Marketing", "HR Manager", "Accountant"];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Search Section */}
      <div className="bg-gradient-to-br from-[#0076BC] via-[#0099CC] to-[#00A86B] py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            Find Your Dream Job
          </h1>
          <p className="text-blue-100 text-lg mb-10">
            Explore thousands of live opportunities across India
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); load(); }}
            className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3"
          >
            <div className="flex items-center flex-1 gap-2 px-3 border border-slate-200 rounded-xl focus-within:border-[#0076BC] focus-within:ring-2 focus-within:ring-blue-100 transition">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                className="w-full py-3 outline-none text-gray-800 placeholder-slate-400 bg-transparent"
                placeholder="Job title, skill or keyword…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {q && (
                <button type="button" onClick={() => setQ("")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center flex-1 gap-2 px-3 border border-slate-200 rounded-xl focus-within:border-[#0076BC] focus-within:ring-2 focus-within:ring-blue-100 transition">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                className="w-full py-3 outline-none text-gray-800 placeholder-slate-400 bg-transparent"
                placeholder="City or location…"
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
              />
              {loc && (
                <button type="button" onClick={() => setLoc("")} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-60 whitespace-nowrap shrink-0 shadow-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {loading ? "Searching…" : "Search Jobs"}
            </button>
          </form>

          {/* Quick search chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {quickSearches.map((keyword) => (
              <button
                key={keyword}
                onClick={() => { setQ(keyword); load(keyword, loc); }}
                className="bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-1.5 rounded-full transition backdrop-blur-sm border border-white/30 font-medium"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">
        {/* Results header */}
        {(jobs.length > 0 || hasSearched) && !loading && (
          <div className="flex items-center justify-between mb-6">
            <p className="text-slate-600 font-medium">
              {jobs.length > 0
                ? <><span className="text-slate-900 font-bold">{jobs.length}</span> jobs found{q ? ` for "${q}"` : ""}{loc ? ` in ${loc}` : ""}</>
                : "No results found"}
            </p>
            {hasSearched && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition font-medium"
              >
                <X className="w-4 h-4" /> Clear results
              </button>
            )}
          </div>
        )}

        {/* Skeleton loaders */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Job cards */}
        {!loading && jobs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-green-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-[#0076BC]" />
                  </div>
                  {job.contract && (
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CONTRACT_COLORS[job.contract] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {CONTRACT_LABELS[job.contract] || job.contract}
                    </span>
                  )}
                </div>

                {/* Title & Company */}
                <h3 className="text-lg font-bold text-slate-800 leading-snug mb-1 line-clamp-2">
                  {job.title}
                </h3>
                <p className="text-sm font-semibold text-[#0076BC] mb-3">{job.company}</p>

                {/* Description */}
                {job.description && (
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3 flex-1">
                    {job.description}
                  </p>
                )}

                {/* Meta chips */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {job.location}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
                      <BadgeDollarSign className="w-3 h-3" />
                      {job.salary}
                    </span>
                  )}
                </div>

                {/* Apply Button & Match Button */}
                <div className="mt-auto flex flex-col gap-3">
                  {matchScores[job.id]?.data ? (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-orange-700 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-orange-500" /> Match Score</span>
                        <span className="font-black text-lg text-orange-600">{matchScores[job.id].data.matchScore}%</span>
                      </div>
                      <p className="text-orange-800/80 text-xs leading-relaxed font-medium">{matchScores[job.id].data.recommendation}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCheckMatch(job)}
                      disabled={matchScores[job.id]?.loading}
                      className="w-full flex items-center justify-center gap-2 bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 font-semibold py-2.5 rounded-xl transition shadow-sm text-sm"
                    >
                      {matchScores[job.id]?.loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <><Sparkles className="w-4 h-4" /> Check AI Match Score</>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => handleApply(job.applyUrl)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white font-semibold py-2.5 rounded-xl hover:opacity-90 transition shadow-sm text-sm"
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
              <FileSearch className="w-10 h-10 text-[#0076BC]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">
              {hasSearched ? "No jobs found" : "Start your job search"}
            </h2>
            <p className="text-slate-400 max-w-md text-base leading-relaxed">
              {hasSearched
                ? "Try using different keywords or a broader location like \"Delhi\" or \"Bangalore\"."
                : "Enter a job title or keyword above, or click one of the quick search chips to explore openings."}
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
