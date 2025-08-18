const request = require("supertest");
const app = require("../server");
const User = require("../models/user.model");

describe("Auth Routes", () => {
  describe("POST /api/v1/auth/signup", () => {
    it("should create a new user", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        passwordConfirm: "password123",
      };

      const response = await request(app)
        .post("/api/v1/auth/signup")
        .send(userData)
        .expect(201);

      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body).toHaveProperty("token");
    });

    it("should not create user with invalid email", async () => {
      const userData = {
        name: "Test User",
        email: "invalid-email",
        password: "password123",
        passwordConfirm: "password123",
      };

      await request(app).post("/api/v1/auth/signup").send(userData).expect(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeEach(async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      await user.save();
    });

    it("should login with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body.data.email).toBe(loginData.email);
    });

    it("should not login with invalid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      await request(app).post("/api/v1/auth/login").send(loginData).expect(401);
    });
  });
});
