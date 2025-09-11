const request = require("supertest");
const app = require("../../server");
const csrfService = require("../../src/services/csrf.service");

describe("CSRF Protection Integration Tests", () => {
  let csrfToken;

  beforeAll(async () => {
    // Generate a CSRF token for testing
    csrfToken = await csrfService.generateToken();
  });

  it("should reject requests without a CSRF token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "CSRF token missing or invalid");
  });

  it("should accept requests with a valid CSRF token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("X-CSRF-Token", csrfToken)
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Login successful");
  });

  it("should reject requests with an invalid CSRF token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("X-CSRF-Token", "invalid-token")
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "CSRF token missing or invalid");
  });
});