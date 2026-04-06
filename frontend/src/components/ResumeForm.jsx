import { useState } from "react";

function ResumeForm({ onSave }) {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        summary: "",
        skills: "",
        education: "",
        experience: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            skills: form.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
        };
        onSave && onSave(payload);
    };

    return (
        <form className="card grid" onSubmit={handleSubmit}>
            <div className="grid grid-2">
                <div>
                    <label className="label">Full Name</label>
                    <input
                        className="input"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label className="label">Email</label>
                    <input
                        className="input"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="grid grid-2">
                <div>
                    <label className="label">Phone</label>
                    <input
                        className="input"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="label">Professional Summary</label>
                    <input
                        className="input"
                        name="summary"
                        value={form.summary}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="grid grid-2">
                <div>
                    <label className="label">Skills (comma separated)</label>
                    <input
                        className="input"
                        name="skills"
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="Communication, MS Office, Retail"
                    />
                </div>
                <div>
                    <label className="label">Education</label>
                    <input
                        className="input"
                        name="education"
                        value={form.education}
                        onChange={handleChange}
                        placeholder="12th Pass / B.Com / ITI"
                    />
                </div>
            </div>

            <div>
                <label className="label">Experience</label>
                <textarea
                    className="input"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Fresher / 6 months at BigMart as Sales Intern"
                />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn-primary">
                    Save Resume
                </button>
            </div>
        </form>
    );
}

export default ResumeForm;
