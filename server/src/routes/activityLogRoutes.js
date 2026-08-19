import { Router } from "express";
import { getActivityLogs } from "../controller/activityLogController.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", requireRole("admin"), asyncHandler(getActivityLogs));

export default router;