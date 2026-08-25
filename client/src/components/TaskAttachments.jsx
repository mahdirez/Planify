import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAttachFile, MdOutlineDescription, MdClose } from "react-icons/md";
import {
    uploadAttachmentApi,
    getTaskAttachmentsApi,
    downloadAttachmentApi,
    deleteAttachmentApi,
} from "../api/attachments.api";

export default function TaskAttachments({ taskId }) {
    const { t } = useTranslation();
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
        <div className="ms-8 mt-2">
            <div className="flex flex-wrap items-center gap-2">
                {attachments.map((a) => (
                    <span
                        key={a.id}
                        className="group/chip flex items-center gap-1.5 rounded-lg bg-slate-100 py-1 ps-2 pe-1.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
            <button
                onClick={() => handleDownload(a)}
                className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400"
            >
              <MdOutlineDescription size={14} />
              <span className="max-w-[140px] truncate">{a.original_name}</span>
            </button>
            <button
                onClick={() => handleDelete(a.id)}
                className="rounded p-0.5 text-slate-400 opacity-0 transition-opacity hover:text-red-500 group-hover/chip:opacity-100"
            >
              <MdClose size={13} />
            </button>
          </span>
                ))}

                <label className="flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-400 hover:text-brand-600 dark:hover:text-brand-400">
                    <MdAttachFile size={14} />
                    {uploading ? t("common.loading") : t("tasks.addAttachment")}
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            </div>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}