import { Router } from "express";
import { register, login } from "../controller/authController.js";
import { validate } from "../middleware/validateMiddleware.js";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema), login);

export default router;
