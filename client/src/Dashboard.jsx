import { useEffect, useState } from "react";
import { api } from "./utils/api";
import { theme } from "./utils/theme";

const STATUSES = ["applied", "interviewing", "offer", "rejected", "withdrawn"];

// Today's date as YYYY-MM-DD (the date picker and database need this format)
const today = () => {
    const d = new Date();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()} -${month} -${day} `;
};

// Turns YYYY-MM-DD into MM/DD/YYYY for display
const formatDate = (iso) => {
    if (!iso) return "";
    const [year, month, day] = iso.split("-");
    return `${month}/${day}/${year} `;
};

const normalizeUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;
};

export default function Dashboard({ user, onLogout }) {

    const [apps, setApps] = useState([]);
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");

    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState({});

    const [link, setLink] = useState("");
    const [dateApplied, setDateApplied] = useState(today());

    useEffect(() => {
        api.getApps().then(setApps).catch((err) => setError(err.message));
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const created = await api.createApp({ company, role, link, date_applied: dateApplied });
            setApps((currentApps) => [created, ...currentApps]);
            setCompany("");
            setRole("");
            setLink("");
            setDateApplied(today());
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatus = async (id, status) => {
        try {
            const updated = await api.updateStatus(id, status);
            setApps((currentApps) =>
                currentApps.map((a) => (a.id === id ? updated : a))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.deleteApp(id);
            setApps((currentApps) =>
                currentApps.filter((a) => a.id !== id)
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        await api.logout();
        onLogout();
    };

    const startEdit = (app) => {
        setEditingId(app.id);
        setDraft({
            company: app.company,
            role: app.role,
            link: app.link,
            date_applied: app.date_applied,
            notes: app.notes,
        });
    };

    const saveEdit = async (id) => {
        try {
            const updated = await api.updateApp(id, draft);
            setApps((currentApps) =>
                currentApps.map((a) => (a.id === id ? updated : a))
            );
            setEditingId(null);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={theme.page}>
            <div className={theme.container}>
                <div className={theme.header}>
                    <h1 className={theme.title}>NextRole</h1>
                    <p className={theme.tagline}>Application Tracker</p>
                    <div className={theme.userControls}>
                        <span className={theme.username}>{user.email}</span>
                        <button className={theme.logoutButton} onClick={handleLogout}>Log out</button>
                    </div>
                </div>


                {error && <p className={theme.error}>{error}</p>}

                <form className={theme.card} onSubmit={handleAdd}>
                    <input className={theme.input} placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                    <input className={theme.input} placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
                    <input className={theme.input} placeholder="Link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
                    <input className={theme.input} type="date" value={dateApplied} onChange={(e) => setDateApplied(e.target.value)} />
                    <button className={theme.button} type="submit">Add application</button>
                </form>

                {apps.length === 0 && <p>No applications yet.</p>}
                {apps.map((app) =>
                    editingId === app.id ? (
                        <div className={theme.card} key={app.id}>
                            <input className={theme.input} value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
                            <input className={theme.input} value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
                            <input className={theme.input} placeholder="Link" value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} />
                            <input className={theme.input} type="date" value={draft.date_applied} onChange={(e) => setDraft({ ...draft, date_applied: e.target.value })} />
                            <textarea className={theme.input} placeholder="Notes" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
                            <div className={theme.row}>
                                <button type="button" className={theme.button} onClick={() => saveEdit(app.id)}>Save</button>
                                <button type="button" className={theme.button} onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className={theme.card} key={app.id}>
                            <p className={theme.companyName}><strong>{app.company}</strong></p>
                            <span className={theme.role}>Position: {app.role}</span>
                            <p className={theme.date}>Applied {formatDate(app.date_applied)}</p>
                            {app.link && <a className={theme.appLink} href={normalizeUrl(app.link)} target="_blank" rel="noreferrer">Job posting</a>}
                            {app.notes && <p className={theme.notes}>Notes: {app.notes}</p>}
                            <div className={theme.row}>
                                <select className={theme.dropdown} value={app.status} onChange={(e) => handleStatus(app.id, e.target.value)}>
                                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                                </select>
                                <div className={theme.editButtons}>
                                    <button type="button" className={theme.button} onClick={() => startEdit(app)}>Edit</button>
                                    <button type="button" className={theme.buttonDanger} onClick={() => handleDelete(app.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
