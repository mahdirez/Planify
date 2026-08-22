import { api } from "./client";

export const uploadAttachmentApi = (taskId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/api/tasks/${taskId}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const getTaskAttachmentsApi = (taskId) =>
    api.get(`/api/tasks/${taskId}/attachments`);

export const downloadAttachmentApi = (attachmentId) =>
    api.get(`/api/attachments/${attachmentId}/download`, {
        responseType: "blob",
    });

export const deleteAttachmentApi = (attachmentId) =>
    api.delete(`/api/attachments/${attachmentId}`);