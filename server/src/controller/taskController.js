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

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
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
      "UPDATE tasks SET description = $1, completed = $2 WHERE id = $3 RETURNING *",
      [description, completed, id],
    );
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(updatedTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (Number.isNaN(Number(id))) {
      return res.status(400).json({
        error: "Invalid task id",
      });
    }
    const deletedTask = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING *",
      [id],
    );
    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json(deletedTask.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
