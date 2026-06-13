import pool from "../config/db.js";

export const addTask = async (req, res) => {
  try {
    const { description, completed } = req.body;
    const newTask = await pool.query(
      "INSERT INTO tasks (description, completed) VALUES ($1, $2) RETURNING *",
      [description, completed || false],
    );
    res.json(newTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );
    res.json(tasks.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (task.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
