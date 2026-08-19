import pool from "../config/db.js";

export const getAllUsers = async (req, res) => {
    const result = await pool.query(
        "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC",
    );
    return res.status(200).json(result.rows);
};