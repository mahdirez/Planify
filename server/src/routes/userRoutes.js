import { Router } from "express";
import { getAllUsers } from "../controller/userController.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", requireRole("admin"), asyncHandler(getAllUsers));

export default router;