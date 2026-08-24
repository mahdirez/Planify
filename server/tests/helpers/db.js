import pool from "../../src/config/db.js";

export const clearDatabase = async () => {
    await pool.query("TRUNCATE TABLE activity_logs, task_attachments, tasks, users RESTART IDENTITY CASCADE");
};

export const closeDatabase = async () => {
    await pool.end();
};