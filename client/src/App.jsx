import { useEffect, useState } from "react";
import { api } from "./utils/api";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // On page load, ask the server if our session cookie is still valid
    useEffect(() => {
        api.me().then((data) => {
            setUser(data.user);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading...</p>;

    return user ? (
        <Dashboard user={user} onLogout={() => setUser(null)} />
    ) : (
        <Auth onAuth={setUser} />
    );
}