const request = require("supertest");
const app = require("../server");
const csrfService = require("../src/services/csrf.service");

describe("CSRF Protection", () => {
  let csrfToken;

  beforeAll(async () => {
    // Generate a CSRF token for testing
    csrfToken = await csrfService.generateToken();
  });

  it("should validate a correct CSRF token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("X-CSRF-Token", csrfToken)
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Login successful");
  });

  it("should reject a request with an invalid CSRF token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .set("X-CSRF-Token", "invalid-token")
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error", "Invalid CSRF token");
  });

  it("should reject a request without a CSRF token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ username: "testuser", password: "testpass" });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error", "CSRF token missing");
  });
});