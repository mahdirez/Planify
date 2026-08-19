import { useEffect, useState } from "react";
import { getAllUsersApi } from "../api/users.api";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllUsersApi()
            .then((res) => setUsers(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-slate-300 p-6">Loading...</p>;

    return (
        <div className="p-6 text-slate-900">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-slate-700">
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Joined</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-800">
                        <td className="py-2">{u.email}</td>
                        <td className="py-2">{u.role}</td>
                        <td className="py-2">
                            {new Date(u.created_at).toLocaleDateString()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}