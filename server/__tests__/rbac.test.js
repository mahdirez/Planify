import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";
import { clearDatabase, closeDatabase } from "../tests/helpers/db.js";

const registerAndLogin = async (email) => {
    const res = await request(app).post("/api/auth/register").send({
        email,
        password: "Password123!",
    });
    return { token: res.body.token, userId: res.body.user.id };
};

const promoteToAdmin = async (userId) => {
    await pool.query("UPDATE users SET role = $1 WHERE id = $2", ["admin", userId]);
};

describe("RBAC", () => {
    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe("GET /api/users (admin only)", () => {
        it("should reject a regular user with 403", async () => {
            const { token } = await registerAndLogin("regular@example.com");

            const res = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(403);
        });

        it("should allow an admin user with 200", async () => {
            const { token, userId } = await registerAndLogin("admin@example.com");
            await promoteToAdmin(userId);

            const res = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it("should reject requests with no token at all", async () => {
            const res = await request(app).get("/api/users");
            expect(res.status).toBe(401);
        });
    });

    describe("GET /api/activity-logs (admin only)", () => {
        it("should reject a regular user with 403", async () => {
            const { token } = await registerAndLogin("regular2@example.com");

            const res = await request(app)
                .get("/api/activity-logs")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(403);
        });

        it("should allow an admin user with 200", async () => {
            const { token, userId } = await registerAndLogin("admin2@example.com");
            await promoteToAdmin(userId);

            const res = await request(app)
                .get("/api/activity-logs")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
        });
    });

    describe("GET /api/dashboard/system-stats (admin only)", () => {
        it("should reject a regular user with 403", async () => {
            const { token } = await registerAndLogin("regular3@example.com");

            const res = await request(app)
                .get("/api/dashboard/system-stats")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(403);
        });

        it("should allow an admin user with 200", async () => {
            const { token, userId } = await registerAndLogin("admin3@example.com");
            await promoteToAdmin(userId);

            const res = await request(app)
                .get("/api/dashboard/system-stats")
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
        });
    });

    describe("Role change takes effect immediately", () => {
        it("should grant access as soon as role is updated in DB, without re-login", async () => {
            const { token, userId } = await registerAndLogin("promote-test@example.com");

            const before = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);
            expect(before.status).toBe(403);

            await promoteToAdmin(userId);

            const after = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${token}`);
            expect(after.status).toBe(200);
        });
    });
});