import { Router } from "express";
import { register, login } from "../controller/authController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/register", validate(registerSchema), asyncHandler(register));

router.post("/login", validate(loginSchema), asyncHandler(login));

export default router;
