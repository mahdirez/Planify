import { Router } from "express";
import {
  addTask,
  getTaskById,
  getTasks,
  updateTask,
  deleteTask,
} from "../controller/taskController.js";

const router = Router();

router.post("/", addTask);

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;
