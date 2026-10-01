import { useEffect, useState } from "react";
import { api } from "./api";
import { theme } from "./utils/theme";

const STATUSES = ["applied", "interview", "offer", "rejected"];

export default function Dashboard({ user, onLogout }) {
    const [apps, setApps] = useState([]);
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        api.getApps().then(setApps).catch((err) => setError(err.message));
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const created = await api.createApp({ company, role });
            setApps([created, ...apps]);
            setCompany("");
            setRole("");
            setError("");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleStatus = async (id, status) => {
        try {
            const updated = await api.updateStatus(id, status);
            setApps(apps.map((a) => (a.id === id ? updated : a)));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.deleteApp(id);
            setApps(apps.filter((a) => a.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        await api.logout();
        onLogout();
    };

    return (
        <div className={theme.page}>
            <div className={theme.row}>
                <h1 className={theme.heading}>NextRole</h1>
                <span>{user.email}</span>
                <button className={theme.button} onClick={handleLogout}>Log out</button>
            </div>

            {error && <p className={theme.error}>{error}</p>}

            <form className={theme.card} onSubmit={handleAdd}>
                <input className={theme.input} placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
                <input className={theme.input} placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
                <button className={theme.button} type="submit">Add application</button>
            </form>

            {apps.length === 0 && <p>No applications yet.</p>}
            {apps.map((app) => (
                <div className={theme.card} key={app.id}>
                    <p><strong>{app.company}</strong>: {app.role}</p>
                    <div className={theme.row}>
                        <select value={app.status} onChange={(e) => handleStatus(app.id, e.target.value)}>
                            {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                        <button className={theme.buttonDanger} onClick={() => handleDelete(app.id)}>Delete</button>
                    </div>
                </div>
            ))}
        </div>
    );
}