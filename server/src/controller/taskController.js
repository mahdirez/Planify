import pool from "../config/db.js";
import { logActivity } from "../services/activityLog.service.js";

export const addTask = async (req, res) => {
  const { description, completed } = req.body;
  const userId = req.user.id;

  if (!description?.trim()) {
    return res.status(400).json({
      error: "Description is required",
    });
  }

  const newTask = await pool.query(
    "INSERT INTO tasks (description, completed, user_id) VALUES ($1, $2, $3) RETURNING *",
    [description, completed || false, userId],
  );

  await logActivity(userId, "task_create", `Created task #${newTask.rows[0].id}`);

  return res.status(201).json(newTask.rows[0]);
};

export const getTasks = async (req, res) => {
    const userId = req.user.id;
    const { q, completed } = req.query;

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    const conditions = ["user_id = $1"];
    const values = [userId];
    let paramIndex = 2;

    if (q?.trim()) {
        conditions.push(`description ILIKE $${paramIndex}`);
        values.push(`%${q.trim()}%`);
        paramIndex++;
    }

    if (completed === "true" || completed === "false") {
        conditions.push(`completed = $${paramIndex}`);
        values.push(completed === "true");
        paramIndex++;
    }

    const whereClause = conditions.join(" AND ");

    const countResult = await pool.query(
        `SELECT COUNT(*)::int AS total FROM tasks WHERE ${whereClause}`,
        values,
    );
    const total = countResult.rows[0].total;

    const dataQuery = `
        SELECT * FROM tasks
        WHERE ${whereClause}
        ORDER BY created_at DESC
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const tasks = await pool.query(dataQuery, [...values, limit, offset]);

    return res.status(200).json({
        data: tasks.rows,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (Number.isNaN(Number(id))) {
    return res.status(400).json({
      error: "Invalid task id",
    });
  }

  const task = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
    [id, userId],
  );

  if (task.rows.length === 0) {
    return res.status(404).json({
      error: "Task not found or unauthorized",
    });
  }

  return res.json(task.rows[0]);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const completed = req.body.completed ?? false;
  const userId = req.user.id;

  if (Number.isNaN(Number(id))) {
    return res.status(400).json({
      error: "Invalid task id",
    });
  }

  if (!description?.trim()) {
    return res.status(400).json({
      error: "Description is required",
    });
  }

  const updatedTask = await pool.query(
    "UPDATE tasks SET description = $1, completed = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
    [description, completed, id, userId],
  );

  if (updatedTask.rows.length === 0) {
    return res.status(404).json({
      error: "Task not found or unauthorized",
    });
  }

  await logActivity(userId, "task_update", `Updated task #${id}`);

  return res.status(200).json(updatedTask.rows[0]);
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (Number.isNaN(Number(id))) {
    return res.status(400).json({
      error: "Invalid task id",
    });
  }

  const deletedTask = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
    [id, userId],
  );

  if (deletedTask.rows.length === 0) {
    return res.status(404).json({
      error: "Task not found or unauthorized",
    });
  }
  await logActivity(userId, "task_delete", `Deleted task #${id}`);

  return res.status(200).json(deletedTask.rows[0]);
};
