import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users, FileText, Zap, Eye, LogOut, TrendingUp, RefreshCw,
  Shield, Activity, UserCheck, BarChart2, Calendar, Loader2, AlertCircle,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────
const api = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_API_URL || "",
    headers: { Authorization: `Bearer ${token}` },
  });

function StatCard({ icon: Icon, label, value, sub, color, bgColor }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${bgColor} shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-3xl font-black text-slate-800 mt-0.5">{value ?? "—"}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// Simple bar chart using CSS
function BarChart({ data }) {
  const maxViews = Math.max(...data.map((d) => d.pageViews), 1);
  const maxUnique = Math.max(...data.map((d) => d.uniqueVisitors), 1);
  const overall = Math.max(maxViews, maxUnique, 1);

  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10">
            <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
              <p className="font-semibold">{d.label}</p>
              <p className="text-emerald-400">{d.uniqueVisitors} unique</p>
              <p className="text-blue-400">{d.pageViews} views</p>
            </div>
          </div>

          <div className="w-full flex gap-1 items-end h-32">
            <div
              className="flex-1 bg-gradient-to-t from-[#0076BC] to-blue-400 rounded-t-md transition-all duration-700"
              style={{ height: `${(d.pageViews / overall) * 100}%`, minHeight: d.pageViews > 0 ? 4 : 0 }}
            />
            <div
              className="flex-1 bg-gradient-to-t from-[#00A86B] to-emerald-400 rounded-t-md transition-all duration-700"
              style={{ height: `${(d.uniqueVisitors / overall) * 100}%`, minHeight: d.uniqueVisitors > 0 ? 4 : 0 }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-medium truncate w-full text-center">
            {d.label.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");

  const fetchStats = useCallback(async () => {
    if (!token) { navigate("/admin"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await api(token).get("/api/admin/stats");
      if (res.data.sts === 0) {
        setStats(res.data.stats);
        setLastUpdated(new Date());
      } else {
        setError("Failed to load stats.");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin");
      } else {
        setError("Could not fetch stats. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Topbar ── */}
      <nav className="bg-gradient-to-r from-slate-900 to-[#0d1f35] text-white px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0076BC] to-[#00A86B] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-base leading-tight">YuvaNaukri Admin</h1>
            <p className="text-slate-400 text-xs">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-slate-400 text-xs hidden sm:block">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchStats}
            disabled={loading}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-slate-300 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !stats && (
          <div className="flex items-center justify-center py-32 gap-3 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin" />
            <span className="text-lg font-medium">Loading stats…</span>
          </div>
        )}

        {stats && (
          <>
            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <StatCard
                icon={Users} label="Total Users" value={stats.users.total}
                sub={`+${stats.users.today} today · +${stats.users.thisWeek} this week`}
                color="text-blue-600" bgColor="bg-blue-50"
              />
              <StatCard
                icon={Eye} label="Visitors Today" value={stats.visits.today}
                sub={`${stats.visits.todayPageViews} page views today`}
                color="text-emerald-600" bgColor="bg-emerald-50"
              />
              <StatCard
                icon={FileText} label="Resumes Created" value={stats.resumes.total}
                color="text-violet-600" bgColor="bg-violet-50"
              />
              <StatCard
                icon={Zap} label="ATS Checks Done" value={stats.ats.total}
                sub="all time"
                color="text-amber-600" bgColor="bg-amber-50"
              />
            </div>

            {/* ── Chart + Live Pulse Row ── */}
            <div className="grid lg:grid-cols-3 gap-5 mb-8">
              {/* 7-day chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#0076BC]" /> Last 7 Days Traffic
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Page Views</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Unique Visitors</span>
                  </div>
                </div>
                <BarChart data={stats.chartData} />
              </div>

              {/* Quick numbers */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-5">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" /> Quick Stats
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Total Page Views (7d)", value: stats.visits.totalPageViews, color: "text-blue-600" },
                    { label: "Unique Visitors (7d)", value: stats.visits.totalUniqueVisitors, color: "text-emerald-600" },
                    { label: "Resumes per User", value: stats.users.total > 0 ? (stats.resumes.total / stats.users.total).toFixed(1) : 0, color: "text-violet-600" },
                    { label: "New Users This Week", value: stats.users.thisWeek, color: "text-amber-600" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <span className="text-sm text-slate-500">{item.label}</span>
                      <span className={`text-lg font-black ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Recent Users Table ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#0076BC]" /> Recently Registered Users
                </h2>
                <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full font-medium">Last 10</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 text-left">
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">AI Uses</th>
                      <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">ATS Checks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {stats.recentUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">{u.user_name}</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{u.user_email}</td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-bold text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full">{u.aiUsageCount}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">{u.atsUsageCount}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-slate-400 text-xs mt-8">
              YuvaNaukri Admin · Auto-refreshes every 60s ·{" "}
              <a href="/" className="hover:text-slate-600 transition">View Site →</a>
            </p>
          </>
        )}
      </main>
    </div>
  );
}
