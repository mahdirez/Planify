import { useEffect, useState } from "react";
import {
    uploadAttachmentApi,
    getTaskAttachmentsApi,
    downloadAttachmentApi,
    deleteAttachmentApi,
} from "../api/attachments.api";

export default function TaskAttachments({ taskId }) {
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const loadAttachments = () => {
        getTaskAttachmentsApi(taskId).then((res) => setAttachments(res.data));
    };

    useEffect(() => {
        loadAttachments();
    }, [taskId]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setError("");
        setUploading(true);
        try {
            await uploadAttachmentApi(taskId, file);
            loadAttachments();
        } catch (err) {
            setError(err.response?.data?.error || "Upload failed");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleDownload = async (attachment) => {
        const res = await downloadAttachmentApi(attachment.id);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", attachment.original_name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleDelete = async (attachmentId) => {
        await deleteAttachmentApi(attachmentId);
        loadAttachments();
    };

    return (
        <div className="mt-3 rounded-2xl bg-slate-950/60 border border-slate-800 p-3">
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-400">Attachments</p>
                <label className="cursor-pointer text-sm text-cyan-400 hover:text-cyan-300">
                    {uploading ? "Uploading..." : "+ Add file"}
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            </div>

            {error && <p className="text-sm text-red-400 mb-2">{error}</p>}

            {attachments.length === 0 ? (
                <p className="text-sm text-slate-600">No attachments yet</p>
            ) : (
                <ul className="space-y-1">
                    {attachments.map((a) => (
                        <li
                            key={a.id}
                            className="flex items-center justify-between text-sm text-slate-300"
                        >
                            <button
                                onClick={() => handleDownload(a)}
                                className="hover:text-cyan-400 truncate text-left"
                            >
                                {a.original_name}
                            </button>
                            <button
                                onClick={() => handleDelete(a.id)}
                                className="text-red-400 hover:text-red-300 ml-2"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}