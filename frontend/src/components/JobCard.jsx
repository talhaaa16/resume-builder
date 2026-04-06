export default function JobCard({ job, onApply }) {
    return (
        <div className="card" role="article" aria-label={job.title}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12 }}>
                <div>
                    <h3 style={{ margin: 0 }}>{job.title}</h3>
                    <p style={{ margin: "6px 0", color: "var(--muted)" }}>{job.company} • {job.location}</p>
                </div>
                {job.type && <span className="badge">{job.type}</span>}
            </div>
            {job.description && (
                <p style={{ marginTop: 8, marginBottom: 12, color: "#374151" }}>
                    {job.description.length > 140 ? job.description.slice(0, 140) + "…" : job.description}
                </p>
            )}
            <div style={{ display: "flex", gap: 8 }}>
                {job.applyUrl ? (
                    <a className="btn btn-outline" href={job.applyUrl} target="_blank" rel="noreferrer">View / Apply</a>
                ) : (
                    <button className="btn btn-outline" onClick={() => onApply && onApply(job)}>Apply</button>
                )}
                {job.salary && <span className="badge">₹ {job.salary}</span>}
            </div>
        </div>
    );
}