import { Router } from "express";
import { addTask } from "../controller/taskController.js";

const router = Router();

router.post("/", addTask);

export default router;
