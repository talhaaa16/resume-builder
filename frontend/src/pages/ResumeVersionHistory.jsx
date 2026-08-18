import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import {
  History, ArrowLeft, Save, RotateCcw, Trash2, Eye,
  Loader2, AlertCircle, Calendar, Tag, FileText, Edit2,
} from "lucide-react";

const API = process.env.REACT_APP_API_URL || "";

function fmtDate(iso) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ResumeVersionHistory() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [resume, setResume] = useState(null);
  const [versions, setVersions] = useState([]);
  const [maxVersions, setMaxVersions] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmIdx, setConfirmIdx] = useState(null);
  const [restoreIdx, setRestoreIdx] = useState(null);
  const [snapshotLabel, setSnapshotLabel] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const token = localStorage.getItem("token");
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchAll();
  }, [resumeId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAll = async () => {
    try {
      const [resumeRes, versionsRes] = await Promise.all([
        axios.get(`${API}/api/resume/${resumeId}`, { headers: authHeader }),
        axios.get(`${API}/api/resume/${resumeId}/versions`, { headers: authHeader }),
      ]);
      if (resumeRes.data.sts === 0) setResume(resumeRes.data.resume);
      else setError("Resume not found.");
      if (versionsRes.data.sts === 0) {
        setVersions(versionsRes.data.versions);
        setMaxVersions(versionsRes.data.maxVersions);
      }
    } catch {
      setError("Failed to load version history.");
    } finally {
      setLoading(false);
    }
  };

  const saveSnapshot = async () => {
    setBusy(true);
    try {
      const res = await axios.post(
        `${API}/api/resume/${resumeId}/versions`,
        { label: snapshotLabel.trim() || undefined },
        { headers: authHeader }
      );
      if (res.data.sts === 0) {
        showToast("Snapshot saved!");
        setSnapshotLabel("");
        setShowSaveDialog(false);
        await fetchAll();
      } else {
        showToast(res.data.msg || "Failed to save snapshot", "error");
      }
    } catch {
      showToast("Failed to save snapshot.", "error");
    } finally {
      setBusy(false);
    }
  };

  const restoreSnapshot = async (idx) => {
    setBusy(true);
    try {
      const res = await axios.post(
        `${API}/api/resume/${resumeId}/versions/${idx}/restore`,
        {},
        { headers: authHeader }
      );
      if (res.data.sts === 0) {
        showToast("Version restored to your resume.");
        setRestoreIdx(null);
        setResume(res.data.resume);
        await fetchAll();
      } else {
        showToast(res.data.msg || "Failed to restore", "error");
      }
    } catch {
      showToast("Failed to restore version.", "error");
    } finally {
      setBusy(false);
    }
  };

  const deleteSnapshot = async (idx) => {
    setBusy(true);
    try {
      const res = await axios.delete(
        `${API}/api/resume/${resumeId}/versions/${idx}`,
        { headers: authHeader }
      );
      if (res.data.sts === 0) {
        showToast("Snapshot deleted.");
        setConfirmIdx(null);
        await fetchAll();
      } else {
        showToast(res.data.msg || "Failed to delete", "error");
      }
    } catch {
      showToast("Failed to delete snapshot.", "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#0076BC] animate-spin" />
          <p className="text-slate-500 text-sm font-semibold animate-pulse">
            Loading version history…
          </p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2 bg-[#0076BC] text-white rounded-xl font-semibold text-sm hover:opacity-90"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );

  const resumeName = resume?.personalInfo?.fullName || "Untitled Resume";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#0076BC] mb-3"
            >
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
              <History className="w-7 h-7 text-[#0076BC]" />
              Version History
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <FileText className="w-4 h-4" /> {resumeName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/resume-builder", {
                state: { resumeData: resume }
              })}
              disabled={!resume}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#0076BC] border border-[#0076BC] rounded-xl font-semibold text-sm hover:bg-blue-50 transition"
            >
              <Edit2 className="w-4 h-4" /> Edit Current
            </button>
            <button
              onClick={() => setShowSaveDialog(true)}
              disabled={!resume}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0076BC] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition shadow-md"
            >
              <Save className="w-4 h-4" /> Save Snapshot
            </button>
          </div>
        </div>

        {/* ── Info banner ── */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-800 flex items-start gap-3">
          <History className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            Snapshots let you roll back to earlier versions of this resume.
            Up to <b>{maxVersions}</b> snapshots are kept (FIFO). Use <b>Restore</b> to
            load a snapshot back into your live resume.
          </div>
        </div>

        {/* ── Save dialog ── */}
        {showSaveDialog && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-700">
              <Tag className="w-4 h-4 text-[#0076BC]" /> Name this snapshot (optional)
            </div>
            <input
              type="text"
              value={snapshotLabel}
              onChange={(e) => setSnapshotLabel(e.target.value)}
              maxLength={60}
              placeholder="e.g. After adding LinkedIn section"
              className="w-full border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0076BC]"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => { setShowSaveDialog(false); setSnapshotLabel(""); }}
                disabled={busy}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={saveSnapshot}
                disabled={busy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#0076BC] text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-50"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {versions.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
              <History className="w-7 h-7 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-700 mb-2">No snapshots yet</h3>
            <p className="text-slate-400 text-sm mb-5">
              Click "Save Snapshot" to capture the current state of your resume.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {versions.map((v) => {
              const isCurrentTop = v.index === 0;
              return (
                <li
                  key={`${v.savedAt}-${v.index}`}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#0076BC]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-800 truncate">{v.label}</p>
                      {isCurrentTop && (
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{fmtDate(v.savedAt)}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        // Open builder preloaded with the snapshot's content via state.
                        // We don't have the snapshot payload here, so navigate to builder with current
                        // resume; user can iterate from there. Preview is fetched server-side on demand.
                        navigate("/resume-builder", { state: { resumeData: resume } });
                      }}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      title="Open current resume in builder"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button
                      onClick={() => setRestoreIdx(v.index)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                    <button
                      onClick={() => setConfirmIdx(v.index)}
                      disabled={busy}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* ── Restore confirm ── */}
        {restoreIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" /> Restore this version?
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                The current resume will be replaced with the contents of this
                snapshot. Your live resume changes will be lost (they aren't
                auto-snapshotted). Tip: save a snapshot of the current state first.
              </p>
              <div className="flex items-center gap-2 justify-end mt-5">
                <button
                  onClick={() => setRestoreIdx(null)}
                  disabled={busy}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => restoreSnapshot(restoreIdx)}
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl font-semibold text-sm hover:bg-amber-700 disabled:opacity-50"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                  Restore
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Delete confirm ── */}
        {confirmIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
              <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-600" /> Delete snapshot?
              </h3>
              <p className="text-slate-500 text-sm mt-2">
                This snapshot will be permanently removed. This can't be undone.
              </p>
              <div className="flex items-center gap-2 justify-end mt-5">
                <button
                  onClick={() => setConfirmIdx(null)}
                  disabled={busy}
                  className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteSnapshot(confirmIdx)}
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
