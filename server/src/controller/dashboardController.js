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

export const getSystemStats = async (req, res) => {
    const totals = await pool.query(
        `SELECT
       (SELECT COUNT(*)::int FROM users) AS total_users,
       (SELECT COUNT(*)::int FROM tasks) AS total_tasks,
       (SELECT COUNT(*)::int FROM tasks WHERE completed = true) AS total_completed`,
    );

    const dailyTrend = await pool.query(
        `SELECT DATE(created_at) AS date, COUNT(*)::int AS count
     FROM tasks
     WHERE created_at >= NOW() - INTERVAL '7 days'
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    );

    return res.status(200).json({
        ...totals.rows[0],
        dailyTrend: dailyTrend.rows,
    });
};