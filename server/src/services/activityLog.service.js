import pool from "../config/db.js";

export const logActivity = async (userId, action, details = null) => {
    try {
        await pool.query(
            "INSERT INTO activity_logs (user_id, action, details) VALUES ($1, $2, $3)",
            [userId, action, details],
        );
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};