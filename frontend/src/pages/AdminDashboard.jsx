import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Users, FileText, Zap, Eye, LogOut, RefreshCw,
  Shield, Activity, UserCheck, BarChart2, Loader2, AlertCircle,
  MessageSquare, MessageCircle, Search, Calendar, Clock, ArrowUpDown,
  ChevronLeft, ChevronRight, ExternalLink, Trash2, X, Bot, User,
  Sparkles, Briefcase, Linkedin, ThumbsUp, ThumbsDown, CheckCircle2,
  TrendingUp, Award, Layers
} from "lucide-react";

// ── API Helper ───────────────────────────────────────────────────────────────
const api = (token) =>
  axios.create({
    baseURL: process.env.REACT_APP_API_URL || "",
    headers: { Authorization: `Bearer ${token}` },
  });

// ── Date Formatting Helpers ──────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const formatRelativeTime = (dateString) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    const diffSec = Math.floor((new Date() - d) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 30) return "";
    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return "just now";
  } catch {
    return "";
  }
};

// ── Components ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, bgColor }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition">
      <div className={`p-3 rounded-xl ${bgColor} shrink-0`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">{label}</p>
        <p className="text-2xl font-black text-slate-800 mt-0.5">{value ?? "—"}</p>
        {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
      </div>
    </div>
  );
}

// 7-day Bar Chart
function BarChart({ data }) {
  const maxViews = Math.max(...data.map((d) => d.pageViews), 1);
  const maxUnique = Math.max(...data.map((d) => d.uniqueVisitors), 1);
  const overall = Math.max(maxViews, maxUnique, 1);

  return (
    <div className="flex items-end gap-2 h-44 w-full pt-4">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-10">
            <div className="bg-slate-800 text-white text-xs rounded-xl px-3 py-2 whitespace-nowrap shadow-2xl border border-slate-700">
              <p className="font-bold">{d.label}</p>
              <p className="text-emerald-400 mt-0.5">{d.uniqueVisitors} unique visitors</p>
              <p className="text-blue-400">{d.pageViews} total views</p>
            </div>
          </div>

          <div className="w-full flex gap-1 items-end h-36">
            <div
              className="flex-1 bg-gradient-to-t from-[#0076BC] to-blue-400 rounded-t-md transition-all duration-700 hover:brightness-110"
              style={{ height: `${(d.pageViews / overall) * 100}%`, minHeight: d.pageViews > 0 ? 4 : 0 }}
            />
            <div
              className="flex-1 bg-gradient-to-t from-[#00A86B] to-emerald-400 rounded-t-md transition-all duration-700 hover:brightness-110"
              style={{ height: `${(d.uniqueVisitors / overall) * 100}%`, minHeight: d.uniqueVisitors > 0 ? 4 : 0 }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-medium truncate w-full text-center mt-1">
            {d.label.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "users" | "conversations"
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Users Tab State
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersPages, setUsersPages] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [userSortBy, setUserSortBy] = useState("createdAt");
  const [userSortOrder, setUserSortOrder] = useState("desc");

  // Conversations Tab State
  const [conversationsList, setConversationsList] = useState([]);
  const [convosLoading, setConvosLoading] = useState(false);
  const [convosTotal, setConvosTotal] = useState(0);
  const [convosPage, setConvosPage] = useState(1);
  const [convosPages, setConvosPages] = useState(1);
  const [convoSearch, setConvoSearch] = useState("");
  const [selectedUserFilter, setSelectedUserFilter] = useState(null); // { id, name, email }

  // Active Conversation Transcript Modal State
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [convoTranscript, setConvoTranscript] = useState(null);
  const [transcriptLoading, setTranscriptLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  // ── Fetch Stats ────────────────────────────────────────────────────────────
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
        setError(res.data.msg || "Failed to load stats.");
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("adminToken");
        navigate("/admin");
      } else {
        setError("Could not fetch stats. Check your server connection.");
      }
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  // ── Fetch Users ────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (page = 1) => {
    if (!token) return;
    setUsersLoading(true);
    try {
      const res = await api(token).get("/api/admin/users", {
        params: {
          search: userSearch,
          sortBy: userSortBy,
          sortOrder: userSortOrder,
          page,
          limit: 15,
        },
      });
      if (res.data.sts === 0) {
        setUsersList(res.data.users);
        setUsersTotal(res.data.total);
        setUsersPage(res.data.page);
        setUsersPages(res.data.pages);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setUsersLoading(false);
    }
  }, [token, userSearch, userSortBy, userSortOrder]);

  // ── Fetch Conversations ────────────────────────────────────────────────────
  const fetchConversations = useCallback(async (page = 1) => {
    if (!token) return;
    setConvosLoading(true);
    try {
      const res = await api(token).get("/api/admin/conversations", {
        params: {
          search: convoSearch,
          userId: selectedUserFilter?.id,
          page,
          limit: 15,
        },
      });
      if (res.data.sts === 0) {
        setConversationsList(res.data.conversations);
        setConvosTotal(res.data.total);
        setConvosPage(res.data.page);
        setConvosPages(res.data.pages);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setConvosLoading(false);
    }
  }, [token, convoSearch, selectedUserFilter]);

  // ── Fetch Conversation Transcript ──────────────────────────────────────────
  const openConversationTranscript = async (conversationId) => {
    setActiveConvoId(conversationId);
    setTranscriptLoading(true);
    try {
      const res = await api(token).get(`/api/admin/conversations/${conversationId}/messages`);
      if (res.data.sts === 0) {
        setConvoTranscript(res.data);
      }
    } catch (err) {
      console.error("Failed to load conversation transcript:", err);
    } finally {
      setTranscriptLoading(false);
    }
  };

  const closeConversationTranscript = () => {
    setActiveConvoId(null);
    setConvoTranscript(null);
  };

  const handleDeleteConversation = async (conversationId) => {
    if (!window.confirm("Are you sure you want to delete this conversation and all its messages?")) return;
    try {
      await api(token).delete(`/api/admin/conversations/${conversationId}`);
      closeConversationTranscript();
      fetchConversations(convosPage);
      fetchStats();
    } catch (err) {
      alert("Failed to delete conversation: " + (err.response?.data?.msg || err.message));
    }
  };

  // Initial load
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Lazy tab data loading
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers(usersPage);
    } else if (activeTab === "conversations") {
      fetchConversations(convosPage);
    }
  }, [activeTab, fetchUsers, fetchConversations, usersPage, convosPage]);

  // Debounced user search
  useEffect(() => {
    if (activeTab !== "users") return;
    const timer = setTimeout(() => {
      fetchUsers(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch, userSortBy, userSortOrder, activeTab, fetchUsers]);

  // Debounced convo search
  useEffect(() => {
    if (activeTab !== "conversations") return;
    const timer = setTimeout(() => {
      fetchConversations(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [convoSearch, selectedUserFilter, activeTab, fetchConversations]);

  // Auto-refresh stats every 60s
  useEffect(() => {
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const handleViewUserChats = (u) => {
    setSelectedUserFilter({ id: u._id, name: u.user_name, email: u.user_email });
    setConvoSearch("");
    setActiveTab("conversations");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* ── Topbar ── */}
      <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0d1f35] text-white px-6 py-3.5 shadow-xl sticky top-0 z-40 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0076BC] to-[#00A86B] flex items-center justify-center shadow-lg ring-2 ring-white/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-lg leading-tight tracking-tight">YuvaNaukri</h1>
                <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Admin Portal
                </span>
              </div>
              <p className="text-slate-400 text-xs">Analytics & User Management</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-700/60 text-xs font-bold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              Users & Usage
            </button>
            <button
              onClick={() => setActiveTab("conversations")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === "conversations"
                  ? "bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat Conversations
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-slate-400 text-xs hidden lg:block">
                Synced {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => {
                fetchStats();
                if (activeTab === "users") fetchUsers(usersPage);
                if (activeTab === "conversations") fetchConversations(convosPage);
              }}
              disabled={loading}
              className="p-2 hover:bg-white/10 rounded-xl transition text-slate-300 hover:text-white"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white border border-white/20 px-3 py-1.5 rounded-xl hover:bg-white/10 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ── TAB 1: OVERVIEW ──────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <>
            {loading && !stats && (
              <div className="flex items-center justify-center py-32 gap-3 text-slate-400">
                <Loader2 className="w-7 h-7 animate-spin text-[#0076BC]" />
                <span className="text-lg font-semibold">Loading platform analytics…</span>
              </div>
            )}

            {stats && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* ── Primary Stat Cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={Users}
                    label="Total Users"
                    value={stats.users.total}
                    sub={`+${stats.users.today} today · +${stats.users.thisWeek} this week`}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                  />
                  <StatCard
                    icon={FileText}
                    label="Resumes Created"
                    value={stats.resumes.total}
                    sub="Recruiter-ready templates"
                    color="text-violet-600"
                    bgColor="bg-violet-50"
                  />
                  <StatCard
                    icon={Zap}
                    label="ATS Checks Done"
                    value={stats.ats.total}
                    sub="Resume scoring operations"
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                  />
                  <StatCard
                    icon={Eye}
                    label="Visitors Today"
                    value={stats.visits.today}
                    sub={`${stats.visits.todayPageViews} page views today`}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                  />
                </div>

                {/* ── Feature Usage Cards ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={Sparkles}
                    label="AI Content Polish"
                    value={stats.aiUsage?.total || 0}
                    sub="Bullet & wording rewrites"
                    color="text-sky-600"
                    bgColor="bg-sky-50"
                  />
                  <StatCard
                    icon={Briefcase}
                    label="Interview Prep"
                    value={stats.interviewPrep?.total || 0}
                    sub="AI interview mock sets"
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                  />
                  <StatCard
                    icon={Award}
                    label="Job Matches Checked"
                    value={stats.jobMatch?.total || 0}
                    sub="Resume-to-JD scores"
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                  />
                  <StatCard
                    icon={MessageCircle}
                    label="Chatbot Messages"
                    value={stats.chat?.totalMessages || 0}
                    sub={`${stats.chat?.totalConversations || 0} conversations total`}
                    color="text-teal-600"
                    bgColor="bg-teal-50"
                  />
                </div>

                {/* ── 7-Day Chart & Quick Stats ── */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Traffic Chart */}
                  <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-[#0076BC]" /> Last 7 Days Web Traffic
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Visitor trends and page impressions</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Page Views
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Unique Visitors
                        </span>
                      </div>
                    </div>
                    <BarChart data={stats.chartData} />
                  </div>

                  {/* Summary Breakdown */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
                    <div>
                      <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                        <Activity className="w-5 h-5 text-emerald-500" /> Platform Metrics
                      </h2>
                      <p className="text-xs text-slate-400 mb-4">Summary engagement highlights</p>
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { label: "Total Page Views (7d)", value: stats.visits.totalPageViews, color: "text-blue-600" },
                        { label: "Unique Visitors (7d)", value: stats.visits.totalUniqueVisitors, color: "text-emerald-600" },
                        { label: "Avg Resumes per User", value: stats.users.total > 0 ? (stats.resumes.total / stats.users.total).toFixed(1) : 0, color: "text-violet-600" },
                        { label: "New Users This Week", value: stats.users.thisWeek, color: "text-amber-600" },
                        { label: "Active Chatbot Threads", value: stats.chat?.totalConversations || 0, color: "text-teal-600" },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5 border-b border-slate-100 last:border-0">
                          <span className="text-xs font-medium text-slate-500">{item.label}</span>
                          <span className={`text-base font-black ${item.color}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 mt-2 border-t border-slate-100">
                      <button
                        onClick={() => setActiveTab("users")}
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        Explore Full User Database →
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Recent Users Preview ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-slate-800 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-[#0076BC]" /> Recently Registered Users
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">Showing latest sign-ups with created/updated dates and usage</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("users")}
                      className="text-xs font-bold text-[#0076BC] hover:underline"
                    >
                      View All Users ({stats.users.total}) →
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-3.5">User</th>
                          <th className="px-4 py-3.5">Created Date</th>
                          <th className="px-4 py-3.5">Last Updated</th>
                          <th className="px-3 py-3.5 text-center">Resumes</th>
                          <th className="px-3 py-3.5 text-center">ATS Checks</th>
                          <th className="px-3 py-3.5 text-center">AI Uses</th>
                          <th className="px-3 py-3.5 text-center">Chats</th>
                          <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {stats.recentUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/80 transition">
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-3">
                                {u.profile_pic ? (
                                  <img src={u.profile_pic} alt={u.user_name} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0076BC] to-[#00A86B] text-white flex items-center justify-center font-bold text-xs uppercase">
                                    {u.user_name?.[0] || "U"}
                                  </div>
                                )}
                                <div>
                                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                    {u.user_name}
                                    {u.linkedinId && (
                                      <span title="LinkedIn Account Connected">
                                        <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-slate-400 font-normal">{u.user_email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                              <span className="font-medium">{formatDate(u.createdAt)}</span>
                              <span className="text-[10px] text-slate-400 block">{formatRelativeTime(u.createdAt)}</span>
                            </td>
                            <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                              <span className="font-medium">{formatDate(u.updatedAt)}</span>
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              <span className="px-2 py-0.5 rounded-full font-bold bg-violet-50 text-violet-700 border border-violet-100">
                                {u.resumesCount || 0}
                              </span>
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              <span className="px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-100">
                                {u.atsUsageCount || 0}
                              </span>
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              <span className="px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                {u.aiUsageCount || 0}
                              </span>
                            </td>
                            <td className="px-3 py-3.5 text-center">
                              <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {u.chatCount || 0}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleViewUserChats(u)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#0076BC] hover:bg-blue-50 border border-blue-200 transition"
                              >
                                View Chats
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── TAB 2: USERS & USAGE ─────────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header + Search + Sort Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-800">Registered Users & Feature Usage</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing {usersList.length} of {usersTotal} registered users
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name or email…"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0076BC]/30 focus:border-[#0076BC] transition"
                  />
                  {userSearch && (
                    <button onClick={() => setUserSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
                  <span className="text-slate-400 font-semibold">Sort:</span>
                  <select
                    value={userSortBy}
                    onChange={(e) => setUserSortBy(e.target.value)}
                    className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="updatedAt">Updated Date</option>
                    <option value="user_name">Name</option>
                    <option value="chatCount">Chat Usage</option>
                    <option value="atsUsageCount">ATS Checks</option>
                    <option value="aiUsageCount">AI Improves</option>
                    <option value="interviewPrepCount">Interview Prep</option>
                    <option value="jobMatchCount">Job Matches</option>
                  </select>

                  <button
                    onClick={() => setUserSortOrder(prev => prev === "desc" ? "asc" : "desc")}
                    className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                    title={`Order: ${userSortOrder.toUpperCase()}`}
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {usersLoading ? (
                <div className="py-24 flex items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0076BC]" />
                  <span className="font-semibold text-sm">Loading users…</span>
                </div>
              ) : usersList.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-600 text-base">No users found</p>
                  <p className="text-xs text-slate-400 mt-1">Try refining your search keyword.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3.5">User Info</th>
                        <th className="px-4 py-3.5">Created Date</th>
                        <th className="px-4 py-3.5">Last Updated</th>
                        <th className="px-3 py-3.5 text-center">Resumes</th>
                        <th className="px-3 py-3.5 text-center" title="AI Text Improvement">AI Polish</th>
                        <th className="px-3 py-3.5 text-center" title="ATS Compatibility Checks">ATS Score</th>
                        <th className="px-3 py-3.5 text-center" title="Interview Question Generations">Interview</th>
                        <th className="px-3 py-3.5 text-center" title="LinkedIn Optimizer">LinkedIn</th>
                        <th className="px-3 py-3.5 text-center" title="AI Job Match Score">Job Match</th>
                        <th className="px-3 py-3.5 text-center" title="Chat Messages & Threads">Chatbot</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList.map((u) => (
                        <tr key={u._id} className="hover:bg-slate-50/80 transition">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-3">
                              {u.profile_pic ? (
                                <img src={u.profile_pic} alt={u.user_name} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0076BC] to-[#00A86B] text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                  {u.user_name?.[0] || "U"}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                  {u.user_name}
                                  {u.linkedinId && (
                                    <span title="LinkedIn Account Connected">
                                      <Linkedin className="w-3.5 h-3.5 text-[#0077b5]" />
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-400 font-normal">{u.user_email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Created Date */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                            <span className="font-semibold block">{formatDate(u.createdAt)}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{formatRelativeTime(u.createdAt)}</span>
                          </td>

                          {/* Updated Date */}
                          <td className="px-4 py-3.5 whitespace-nowrap text-slate-600">
                            <span className="font-semibold block">{formatDate(u.updatedAt)}</span>
                            <span className="text-[10px] text-slate-400 font-medium">{formatRelativeTime(u.updatedAt)}</span>
                          </td>

                          {/* Resumes Count */}
                          <td className="px-3 py-3.5 text-center">
                            <span className="px-2.5 py-0.5 rounded-full font-bold bg-violet-50 text-violet-700 border border-violet-100">
                              {u.resumesCount || 0}
                            </span>
                          </td>

                          {/* AI Polish */}
                          <td className="px-3 py-3.5 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-100" title="Lifetime AI Polish count">
                              {u.aiUsageCount || 0}
                            </span>
                          </td>

                          {/* ATS Checks */}
                          <td className="px-3 py-3.5 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-100">
                              {u.atsUsageCount || 0}
                            </span>
                          </td>

                          {/* Interview Prep */}
                          <td className="px-3 py-3.5 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {u.interviewPrepCount || 0}
                            </span>
                          </td>

                          {/* LinkedIn Opt */}
                          <td className="px-3 py-3.5 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-sky-50 text-sky-700 border border-sky-100">
                              {u.linkedinOptimizerCount || 0}
                            </span>
                          </td>

                          {/* Job Matches */}
                          <td className="px-3 py-3.5 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-orange-50 text-orange-700 border border-orange-100">
                              {u.jobMatchCount || 0}
                            </span>
                          </td>

                          {/* Chat Messages */}
                          <td className="px-3 py-3.5 text-center">
                            <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-100" title={`${u.conversationsCount || 0} conversations`}>
                              {u.chatCount || 0}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleViewUserChats(u)}
                              className="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-50 hover:bg-blue-50 text-[#0076BC] border border-slate-200 hover:border-blue-200 transition flex items-center gap-1.5 ml-auto"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              View Chats ({u.conversationsCount || 0})
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {usersPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <p>
                    Page <span className="font-bold text-slate-800">{usersPage}</span> of{" "}
                    <span className="font-bold text-slate-800">{usersPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUsersPage(prev => Math.max(1, prev - 1))}
                      disabled={usersPage <= 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition font-bold flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <button
                      onClick={() => setUsersPage(prev => Math.min(usersPages, prev + 1))}
                      disabled={usersPage >= usersPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition font-bold flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 3: CHAT CONVERSATIONS & MESSAGES ─────────────────────────── */}
        {activeTab === "conversations" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filter banner if active */}
            {selectedUserFilter && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0076BC] animate-pulse" />
                  <p className="text-blue-900">
                    Filtering conversations for user:{" "}
                    <span className="font-bold text-[#0076BC]">{selectedUserFilter.name}</span> ({selectedUserFilter.email})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUserFilter(null)}
                  className="px-3 py-1 bg-white text-blue-700 hover:bg-blue-100 rounded-lg font-bold border border-blue-200 transition"
                >
                  Clear Filter
                </button>
              </div>
            )}

            {/* Header + Search Bar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-800">Chatbot Conversations & Message Logs</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspect exact user queries, AI responses, job recommendations, and timestamps
                </p>
              </div>

              {/* Search */}
              <div className="relative flex-1 sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={convoSearch}
                  onChange={(e) => setConvoSearch(e.target.value)}
                  placeholder="Search title, user name, or email…"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0076BC]/30 focus:border-[#0076BC] transition"
                />
                {convoSearch && (
                  <button onClick={() => setConvoSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversations List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {convosLoading ? (
                <div className="py-24 flex items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0076BC]" />
                  <span className="font-semibold text-sm">Loading conversations…</span>
                </div>
              ) : conversationsList.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  <MessageCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                  <p className="font-bold text-slate-600 text-base">No conversations found</p>
                  <p className="text-xs text-slate-400 mt-1">Users have not started chat sessions matching this criteria yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3.5">Conversation / Title</th>
                        <th className="px-6 py-3.5">User</th>
                        <th className="px-4 py-3.5 text-center">Messages</th>
                        <th className="px-4 py-3.5">Last Message</th>
                        <th className="px-4 py-3.5">Started At</th>
                        <th className="px-6 py-3.5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {conversationsList.map((c) => (
                        <tr key={c._id} className="hover:bg-slate-50/80 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 text-sm max-w-sm truncate" title={c.title}>
                              {c.title || "Untitled Conversation"}
                            </div>
                            {c.lastMessage && (
                              <p className="text-slate-400 text-xs mt-1 truncate max-w-md">
                                <span className="font-semibold text-slate-600">
                                  {c.lastMessage.role === "user" ? "User: " : "AI: "}
                                </span>
                                {c.lastMessage.text}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {c.user ? (
                              <div className="flex items-center gap-2.5">
                                {c.user.profile_pic ? (
                                  <img src={c.user.profile_pic} alt="" className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200" />
                                ) : (
                                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px] uppercase">
                                    {c.user.user_name?.[0] || "U"}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-slate-700">{c.user.user_name}</p>
                                  <p className="text-[11px] text-slate-400">{c.user.user_email}</p>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">User deleted</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className="px-2.5 py-1 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-100">
                              {c.messageCount || 0}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                            <span className="font-medium">{formatDate(c.lastMessageAt)}</span>
                            <span className="text-[10px] text-slate-400 block">{formatRelativeTime(c.lastMessageAt)}</span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                            <span className="font-medium">{formatDate(c.createdAt)}</span>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => openConversationTranscript(c._id)}
                              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white hover:opacity-90 shadow-sm transition flex items-center gap-1.5 ml-auto"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              View Messages
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {convosPages > 1 && (
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <p>
                    Page <span className="font-bold text-slate-800">{convosPage}</span> of{" "}
                    <span className="font-bold text-slate-800">{convosPages}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setConvosPage(prev => Math.max(1, prev - 1))}
                      disabled={convosPage <= 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition font-bold flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Previous
                    </button>
                    <button
                      onClick={() => setConvosPage(prev => Math.min(convosPages, prev + 1))}
                      disabled={convosPage >= convosPages}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition font-bold flex items-center gap-1"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── CONVERSATION TRANSCRIPT MODAL ────────────────────────────────────── */}
      {activeConvoId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0076BC] to-[#00A86B] flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white max-w-md truncate">
                    {convoTranscript?.conversation?.title || "Conversation Transcript"}
                  </h3>
                  {convoTranscript?.conversation?.user && (
                    <p className="text-slate-400 text-xs">
                      User: <span className="text-white font-bold">{convoTranscript.conversation.user.user_name}</span> ({convoTranscript.conversation.user.user_email})
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteConversation(activeConvoId)}
                  title="Delete Conversation"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/10 rounded-xl transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeConversationTranscript}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Message Stream */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50">
              {transcriptLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-[#0076BC]" />
                  <p className="font-bold text-sm">Loading message log…</p>
                </div>
              ) : !convoTranscript?.messages?.length ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MessageCircle className="w-12 h-12 text-slate-300 mb-2" />
                  <p className="font-bold text-slate-600">No messages found</p>
                  <p className="text-xs text-slate-400 mt-1">This conversation has no recorded messages.</p>
                </div>
              ) : (
                convoTranscript.messages.map((m, idx) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m._id || idx}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      {/* Sender label & Timestamp */}
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] font-semibold text-slate-400">
                        {isUser ? (
                          <>
                            <span>{convoTranscript?.conversation?.user?.user_name || "User"}</span>
                            <span>•</span>
                            <span>{formatDate(m.createdAt)}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-[#0076BC] font-bold">Yuva Assistant</span>
                            <span>•</span>
                            <span>{formatDate(m.createdAt)}</span>
                          </>
                        )}
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed whitespace-pre-wrap break-words ${
                          isUser
                            ? "bg-gradient-to-r from-[#0076BC] to-[#0099CC] text-white rounded-tr-sm"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm"
                        }`}
                      >
                        <p>{m.text}</p>

                        {/* Job Recommendations if AI attached jobs */}
                        {m.jobs && m.jobs.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Recommended Jobs ({m.jobs.length}):
                            </p>
                            <div className="grid gap-2">
                              {m.jobs.map((job, jIdx) => (
                                <div key={jIdx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <p className="font-bold text-slate-800 text-sm">{job.title}</p>
                                      <p className="text-[#0076BC] font-semibold mt-0.5">{job.company}</p>
                                      <p className="text-slate-500 text-[11px] mt-0.5">{job.location} · {job.salary || "Salary not disclosed"}</p>
                                    </div>
                                    {job.applyUrl && (
                                      <a
                                        href={job.applyUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shrink-0 p-1.5 bg-white text-[#0076BC] border border-slate-200 rounded-lg hover:bg-blue-50 transition"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* User Feedback Badge if present */}
                        {m.feedback && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                            {m.feedback === "up" ? (
                              <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <ThumbsUp className="w-3 h-3" /> User rated helpful
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                <ThumbsDown className="w-3 h-3" /> User rated not helpful
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>
                Total Messages: <strong className="text-slate-800">{convoTranscript?.messages?.length || 0}</strong>
              </span>
              <button
                onClick={closeConversationTranscript}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-xs border-t border-slate-200/60 bg-white">
        YuvaNaukri Admin Portal · Auto-refreshes every 60s ·{" "}
        <a href="/" className="text-[#0076BC] font-semibold hover:underline">
          View Live Website →
        </a>
      </footer>
    </div>
  );
}
