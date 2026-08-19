import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userRoutes from "./routes/userRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
        credentials: true,
    }),
);

app.use(express.json({ limit: "100kb" }));

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many attempts, please try again later" },
});

app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/tasks", authMiddleware, taskRoutes);

app.use("/api/users", authMiddleware, userRoutes);

app.use("/api/activity-logs", authMiddleware, activityLogRoutes);

app.use("/api/dashboard", authMiddleware, dashboardRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

export default app;