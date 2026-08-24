import request from "supertest";
import app from "../src/app.js";
import { clearDatabase, closeDatabase } from "../tests/helpers/db.js";

describe("Auth API", () => {
    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe("POST /api/auth/register", () => {
        it("should register a new user successfully", async () => {
            const res = await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "Password123!",
            });

            expect(res.status).toBe(201);
            expect(res.body.user.email).toBe("test@example.com");
            expect(res.body.user.role).toBe("user");
            expect(res.body.token).toBeDefined();
            expect(res.body.user.password_hash).toBeUndefined();
        });

        it("should reject duplicate email registration", async () => {
            await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "Password123!",
            });

            const res = await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "AnotherPassword123!",
            });

            expect(res.status).toBe(409);
        });

        it("should reject registration with missing fields", async () => {
            const res = await request(app).post("/api/auth/register").send({
                email: "test@example.com",
            });

            expect(res.status).toBe(400);
        });
    });

    describe("POST /api/auth/login", () => {
        beforeEach(async () => {
            await request(app).post("/api/auth/register").send({
                email: "login-test@example.com",
                password: "Password123!",
            });
        });

        it("should login with correct credentials", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "login-test@example.com",
                password: "Password123!",
            });

            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
            expect(res.body.user.email).toBe("login-test@example.com");
        });

        it("should reject login with wrong password", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "login-test@example.com",
                password: "WrongPassword!",
            });

            expect(res.status).toBe(401);
        });

        it("should reject login with non-existent email", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: "doesnotexist@example.com",
                password: "Password123!",
            });

            expect(res.status).toBe(401);
        });
    });
});