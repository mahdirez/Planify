import { Router } from "express";
import { addTask, getTasks } from "../controller/taskController.js";

const router = Router();

router.post("/", addTask);

router.get("/", getTasks);

export default router;
