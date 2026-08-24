import request from "supertest";
import app from "../src/app.js";
import { clearDatabase, closeDatabase } from "../tests/helpers/db.js";

const registerAndLogin = async (email) => {
    const res = await request(app).post("/api/auth/register").send({
        email,
        password: "Password123!",
    });
    return res.body.token;
};

describe("Tasks API", () => {
    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await closeDatabase();
    });

    describe("POST /api/tasks", () => {
        it("should create a task for the authenticated user", async () => {
            const token = await registerAndLogin("user1@example.com");

            const res = await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({ description: "Buy groceries" });

            expect(res.status).toBe(201);
            expect(res.body.description).toBe("Buy groceries");
            expect(res.body.completed).toBe(false);
        });

        it("should reject task creation without auth token", async () => {
            const res = await request(app)
                .post("/api/tasks")
                .send({ description: "No auth" });

            expect(res.status).toBe(401);
        });
    });

    describe("GET /api/tasks", () => {
        it("should only return tasks belonging to the authenticated user", async () => {
            const tokenA = await registerAndLogin("userA@example.com");
            const tokenB = await registerAndLogin("userB@example.com");

            await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ description: "Task for A" });

            await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ description: "Task for B" });

            const res = await request(app)
                .get("/api/tasks")
                .set("Authorization", `Bearer ${tokenA}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].description).toBe("Task for A");
        });
    });

    describe("PUT /api/tasks/:id", () => {
        it("should update a task owned by the user", async () => {
            const token = await registerAndLogin("user2@example.com");
            const createRes = await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({ description: "Original" });

            const res = await request(app)
                .put(`/api/tasks/${createRes.body.id}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ description: "Updated", completed: true });

            expect(res.status).toBe(200);
            expect(res.body.description).toBe("Updated");
            expect(res.body.completed).toBe(true);
        });

        it("should not allow updating another user's task", async () => {
            const tokenA = await registerAndLogin("ownerA@example.com");
            const tokenB = await registerAndLogin("attackerB@example.com");

            const createRes = await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ description: "A's private task" });

            const res = await request(app)
                .put(`/api/tasks/${createRes.body.id}`)
                .set("Authorization", `Bearer ${tokenB}`)
                .send({ description: "Hacked!" });

            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /api/tasks/:id", () => {
        it("should delete a task owned by the user", async () => {
            const token = await registerAndLogin("user3@example.com");
            const createRes = await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${token}`)
                .send({ description: "To be deleted" });

            const res = await request(app)
                .delete(`/api/tasks/${createRes.body.id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.status).toBe(200);
        });

        it("should not allow deleting another user's task", async () => {
            const tokenA = await registerAndLogin("ownerC@example.com");
            const tokenB = await registerAndLogin("attackerD@example.com");

            const createRes = await request(app)
                .post("/api/tasks")
                .set("Authorization", `Bearer ${tokenA}`)
                .send({ description: "C's private task" });

            const res = await request(app)
                .delete(`/api/tasks/${createRes.body.id}`)
                .set("Authorization", `Bearer ${tokenB}`);

            expect(res.status).toBe(404);
        });
    });
});