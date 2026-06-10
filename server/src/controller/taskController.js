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
