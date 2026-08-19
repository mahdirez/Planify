import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getMyStats, getSystemStats } from "../controller/dashboardController.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/my-stats", asyncHandler(getMyStats));
router.get("/system-stats", requireRole("admin"), asyncHandler(getSystemStats));

export default router;