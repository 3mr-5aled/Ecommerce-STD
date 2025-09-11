/**
 * @fileoverview CSRF Protection Tests
 *
 * This test suite validates the CSRF (Cross-Site Request Forgery) protection
 * middleware implementation. It tests token generation, validation, and
 * security enforcement across different scenarios.
 *
 * Test Coverage:
 * - CSRF token generation and validation
 * - Protection enforcement on state-changing requests
 * - Bypass conditions for safe methods and webhooks
 * - Error handling for invalid/missing tokens
 * - Cookie-based secret management
 *
 * @module tests/csrf
 * @requires jest
 * @requires supertest
 * @requires ../server
 * @requires ../middlewares/csrf.middleware
 *
 * @author E-commerce STD
 * @since 1.0.0
 */

const request = require("supertest");
const app = require("../server");
const { utils } = require("../middlewares/csrf.middleware");

describe("CSRF Protection", () => {
  let csrfToken;
  let csrfSecret;
  let cookies;

  beforeEach(async () => {
    // Get a fresh CSRF token before each test
    const response = await request(app).get("/api/v1/csrf-token").expect(200);

    csrfToken = response.body.data.csrfToken;
    cookies = response.headers["set-cookie"];

    // Extract secret from cookie for testing
    if (cookies) {
      const secretCookie = cookies.find((cookie) =>
        cookie.includes("_csrf_secret")
      );
      if (secretCookie) {
        csrfSecret = secretCookie.split("=")[1].split(";")[0];
      }
    }
  });

  describe("CSRF Token Generation", () => {
    test("should generate CSRF token successfully", async () => {
      const response = await request(app).get("/api/v1/csrf-token").expect(200);

      expect(response.body).toHaveProperty("status", "success");
      expect(response.body.data).toHaveProperty("csrfToken");
      expect(typeof response.body.data.csrfToken).toBe("string");
      expect(response.body.data.csrfToken.length).toBeGreaterThan(0);
    });

    test("should set CSRF secret cookie", async () => {
      const response = await request(app).get("/api/v1/csrf-token").expect(200);

      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();

      const secretCookie = cookies.find((cookie) =>
        cookie.includes("_csrf_secret")
      );
      expect(secretCookie).toBeDefined();
      expect(secretCookie).toMatch(/httponly/i);
      expect(secretCookie).toMatch(/samesite=strict/i);
    });

    test("should generate different tokens on subsequent calls", async () => {
      const response1 = await request(app)
        .get("/api/v1/csrf-token")
        .expect(200);

      const response2 = await request(app)
        .get("/api/v1/csrf-token")
        .expect(200);

      expect(response1.body.data.csrfToken).not.toBe(
        response2.body.data.csrfToken
      );
    });
  });

  describe("CSRF Token Validation", () => {
    test("should accept valid CSRF token in header", async () => {
      // First, create a user or use any protected POST endpoint
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .set("Cookie", cookies)
        .set("X-CSRF-Token", csrfToken)
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          passwordConfirm: "password123",
        });

      // Should not get CSRF error (might get validation errors which is fine)
      expect(response.status).not.toBe(403);
    });

    test("should accept valid CSRF token in request body", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .set("Cookie", cookies)
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          passwordConfirm: "password123",
          _csrf: csrfToken,
        });

      // Should not get CSRF error
      expect(response.status).not.toBe(403);
    });

    test("should reject requests without CSRF token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .set("Cookie", cookies)
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          passwordConfirm: "password123",
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/csrf token missing/i);
    });

    test("should reject requests with invalid CSRF token", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .set("Cookie", cookies)
        .set("X-CSRF-Token", "invalid-token")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          passwordConfirm: "password123",
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/invalid csrf token/i);
    });

    test("should reject requests without CSRF secret cookie", async () => {
      const response = await request(app)
        .post("/api/v1/auth/signup")
        .set("X-CSRF-Token", csrfToken)
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          passwordConfirm: "password123",
        });

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/csrf secret not found/i);
    });
  });

  describe("CSRF Protection Bypass", () => {
    test("should allow GET requests without CSRF token", async () => {
      const response = await request(app).get("/api/v1/categories").expect(200);

      // Should succeed without CSRF token
      expect(response.status).toBe(200);
    });

    test("should allow HEAD requests without CSRF token", async () => {
      const response = await request(app).head("/api/v1/categories");

      // Should succeed without CSRF token
      expect([200, 404]).toContain(response.status);
    });

    test("should allow OPTIONS requests without CSRF token", async () => {
      const response = await request(app).options("/api/v1/categories");

      // Should succeed without CSRF token
      expect([200, 404]).toContain(response.status);
    });

    test("should allow webhook requests without CSRF token", async () => {
      const response = await request(app)
        .post("/webhook-checkout")
        .send({ test: "data" });

      // Should not be blocked by CSRF (might fail for other reasons)
      expect(response.status).not.toBe(403);
    });
  });

  describe("CSRF Utility Functions", () => {
    test("should generate valid secret", () => {
      const secret = utils.generateSecret();

      expect(typeof secret).toBe("string");
      expect(secret.length).toBeGreaterThan(0);
    });

    test("should generate token from secret", () => {
      const secret = utils.generateSecret();
      const token = utils.generateToken(secret);

      expect(typeof token).toBe("string");
      expect(token.length).toBeGreaterThan(0);
    });

    test("should verify valid token", () => {
      const secret = utils.generateSecret();
      const token = utils.generateToken(secret);
      const isValid = utils.verifyToken(secret, token);

      expect(isValid).toBe(true);
    });

    test("should reject invalid token", () => {
      const secret = utils.generateSecret();
      const isValid = utils.verifyToken(secret, "invalid-token");

      expect(isValid).toBe(false);
    });

    test("should reject token with wrong secret", () => {
      const secret1 = utils.generateSecret();
      const secret2 = utils.generateSecret();
      const token = utils.generateToken(secret1);
      const isValid = utils.verifyToken(secret2, token);

      expect(isValid).toBe(false);
    });
  });

  describe("CSRF Protection on Different HTTP Methods", () => {
    test("should protect POST requests", async () => {
      const response = await request(app)
        .post("/api/v1/categories")
        .send({ name: "Test Category" });

      expect(response.status).toBe(403);
    });

    test("should protect PUT requests", async () => {
      const response = await request(app)
        .put("/api/v1/categories/1")
        .send({ name: "Updated Category" });

      expect(response.status).toBe(403);
    });

    test("should protect DELETE requests", async () => {
      const response = await request(app).delete("/api/v1/categories/1");

      expect(response.status).toBe(403);
    });

    test("should protect PATCH requests", async () => {
      const response = await request(app)
        .patch("/api/v1/categories/1")
        .send({ name: "Patched Category" });

      expect(response.status).toBe(403);
    });
  });

  describe("CSRF Error Handling", () => {
    test("should return proper error format for missing token", async () => {
      const response = await request(app)
        .post("/api/v1/categories")
        .set("Cookie", cookies)
        .send({ name: "Test Category" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("status", "fail");
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/csrf token missing/i);
    });

    test("should return proper error format for invalid token", async () => {
      const response = await request(app)
        .post("/api/v1/categories")
        .set("Cookie", cookies)
        .set("X-CSRF-Token", "invalid-token")
        .send({ name: "Test Category" });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("status", "fail");
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toMatch(/invalid csrf token/i);
    });
  });

  describe("Development Environment Override", () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSkipCSRF = process.env.SKIP_CSRF;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      process.env.SKIP_CSRF = originalSkipCSRF;
    });

    test("should skip CSRF in development when SKIP_CSRF is true", async () => {
      process.env.NODE_ENV = "development";
      process.env.SKIP_CSRF = "true";

      const response = await request(app)
        .post("/api/v1/categories")
        .send({ name: "Test Category" });

      // Should not get CSRF error (might get other validation errors)
      expect(response.status).not.toBe(403);
    });

    test("should still enforce CSRF in development when SKIP_CSRF is false", async () => {
      process.env.NODE_ENV = "development";
      process.env.SKIP_CSRF = "false";

      const response = await request(app)
        .post("/api/v1/categories")
        .send({ name: "Test Category" });

      expect(response.status).toBe(403);
    });
  });
});

describe("CSRF Integration with Authentication", () => {
  let csrfToken;
  let cookies;
  let userToken;

  beforeEach(async () => {
    // Get CSRF token
    const csrfResponse = await request(app)
      .get("/api/v1/csrf-token")
      .expect(200);

    csrfToken = csrfResponse.body.data.csrfToken;
    cookies = csrfResponse.headers["set-cookie"];
  });

  test("should require both JWT and CSRF token for authenticated routes", async () => {
    // First, try without both tokens
    const response1 = await request(app).get("/api/v1/users/getMe");

    expect(response1.status).toBe(401); // JWT required

    // Try with CSRF but no JWT
    const response2 = await request(app)
      .post("/api/v1/users")
      .set("Cookie", cookies)
      .set("X-CSRF-Token", csrfToken)
      .send({ name: "Test User" });

    expect(response2.status).toBe(401); // JWT still required
  });
});
