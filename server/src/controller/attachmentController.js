import fs from "fs";
import path from "path";
import pool from "../config/db.js";

export const uploadAttachment = async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user.id;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const task = await pool.query(
        "SELECT id FROM tasks WHERE id = $1 AND user_id = $2",
        [taskId, userId],
    );

    if (task.rows.length === 0) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: "Task not found" });
    }

    const result = await pool.query(
        `INSERT INTO task_attachments (task_id, filename, original_name, mime_type, size)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, original_name, mime_type, size, created_at`,
        [taskId, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size],
    );

    return res.status(201).json(result.rows[0]);
};

export const getTaskAttachments = async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user.id;

    const task = await pool.query(
        "SELECT id FROM tasks WHERE id = $1 AND user_id = $2",
        [taskId, userId],
    );

    if (task.rows.length === 0) {
        return res.status(404).json({ error: "Task not found" });
    }

    const result = await pool.query(
        "SELECT id, original_name, mime_type, size, created_at FROM task_attachments WHERE task_id = $1 ORDER BY created_at DESC",
        [taskId],
    );

    return res.status(200).json(result.rows);
};

export const downloadAttachment = async (req, res) => {
    const { attachmentId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
        `SELECT ta.filename, ta.original_name, ta.mime_type
     FROM task_attachments ta
     JOIN tasks t ON t.id = ta.task_id
     WHERE ta.id = $1 AND t.user_id = $2`,
        [attachmentId, userId],
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Attachment not found" });
    }

    const { filename, original_name, mime_type } = result.rows[0];
    const filePath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found on server" });
    }

    res.setHeader("Content-Type", mime_type);
    res.setHeader("Content-Disposition", `attachment; filename="${original_name}"`);
    return res.sendFile(filePath);
};

export const deleteAttachment = async (req, res) => {
    const { attachmentId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
        `SELECT ta.id, ta.filename
     FROM task_attachments ta
     JOIN tasks t ON t.id = ta.task_id
     WHERE ta.id = $1 AND t.user_id = $2`,
        [attachmentId, userId],
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: "Attachment not found" });
    }

    const filePath = path.join(process.cwd(), "uploads", result.rows[0].filename);

    await pool.query("DELETE FROM task_attachments WHERE id = $1", [attachmentId]);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    return res.status(200).json({ message: "Attachment deleted" });
};