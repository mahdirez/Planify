import { Router } from "express";
import {
  addTask,
  getTaskById,
  getTasks,
  updateTask,
  deleteTask,
} from "../controller/taskController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(addTask));

router.get("/", asyncHandler(getTasks));

router.get("/:id", asyncHandler(getTaskById));

router.put("/:id", asyncHandler(updateTask));

router.delete("/:id", asyncHandler(deleteTask));

export default router;
