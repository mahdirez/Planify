import { Router } from "express";
import {
  addTask,
  getTaskById,
  getTasks,
} from "../controller/taskController.js";

const router = Router();

router.post("/", addTask);

router.get("/", getTasks);

router.get("/:id", getTaskById);

export default router;
