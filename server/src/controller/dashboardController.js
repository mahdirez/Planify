import pool from "../config/db.js";

export const getMyStats = async (req, res) => {
    const userId = req.user.id;

    const result = await pool.query(
        `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE completed = true)::int AS completed,
       COUNT(*) FILTER (WHERE completed = false)::int AS pending
     FROM tasks
     WHERE user_id = $1`,
        [userId],
    );

    return res.status(200).json(result.rows[0]);
};