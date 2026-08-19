import pool from "../config/db.js";

export const getActivityLogs = async (req, res) => {
    const result = await pool.query(
        `SELECT al.id, al.action, al.details, al.created_at, u.email
     FROM activity_logs al
     JOIN users u ON u.id = al.user_id
     ORDER BY al.created_at DESC
     LIMIT 100`,
    );
    return res.status(200).json(result.rows);
};