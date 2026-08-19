import { useEffect, useState } from "react";
import { getActivityLogsApi } from "../api/activityLogs.api";

export default function ActivityLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getActivityLogsApi()
            .then((res) => setLogs(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-slate-900 p-6">Loading...</p>;

    return (
        <div className="p-6 text-slate-900">
            <h1 className="text-2xl font-bold mb-4">Activity Logs</h1>
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-slate-700">
                    <th className="py-2">User</th>
                    <th className="py-2">Action</th>
                    <th className="py-2">Details</th>
                    <th className="py-2">Time</th>
                </tr>
                </thead>
                <tbody>
                {logs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-800">
                        <td className="py-2">{log.email}</td>
                        <td className="py-2">{log.action}</td>
                        <td className="py-2 text-slate-900">{log.details}</td>
                        <td className="py-2 text-slate-900">
                            {new Date(log.created_at).toLocaleString()}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}