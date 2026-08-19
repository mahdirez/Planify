import { Router } from "express";
import { getMyStats } from "../controller/dashboardController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/my-stats", asyncHandler(getMyStats));

export default router;