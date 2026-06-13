import { Router } from "express";
import {
  addTask,
  getTaskById,
  getTasks,
  updateTask,
} from "../controller/taskController.js";

const router = Router();

router.post("/", addTask);

router.get("/", getTasks);

router.get("/:id", getTaskById);

router.put("/:id", updateTask);

export default router;
