# Copilot Instructions for Ecommerce-STD

## Project Overview

- This is a Node.js/Express.js RESTful API for a full-featured e-commerce backend.
- MongoDB (via Mongoose) is used for data storage. Key business logic is in `services/`, models in `models/`, and API routes in `routes/`.
- The entry point is `server.js`. Environment variables are managed in `config.env`.

## Architecture & Patterns

- **Layered Structure:**
  - `models/`: Mongoose schemas for users, products, orders, etc.
  - `services/`: Business logic, including authentication, product management, cart, orders, etc.
  - `routes/`: Express route definitions, grouped by domain (e.g., `auth.route.js`, `product.route.js`).
  - `middlewares/`: Error handling, validation, file upload, and other cross-cutting concerns.
  - `utils/`: Shared utilities (e.g., email, logging, token creation).
- **Error Handling:** Centralized via custom `ApiError` and error middleware.
- **Authentication:** JWT-based, with role-based access control. Password reset uses email codes (see `auth.service.js`).
- **Testing:** Jest is used. Tests are in `tests/`. Use `npm test`, `npm run test:watch`, or `npm run test:coverage`.
- **File Uploads:** Images are stored in `uploads/` and processed with Sharp.
- **Email:** Uses Nodemailer, configured via environment variables.
- **Payment:** Stripe integration (see env vars and relevant service files).

## Developer Workflows

- **Start (dev):** `npm run start:dev`
- **Start (prod):** `npm start`
- **Test:** `npm test`, `npm run test:watch`, `npm run test:coverage`
- **Docker:** `docker-compose up --build` or `docker-compose up -d`
- **Environment:** Copy and edit `config.env` as needed for secrets and service credentials.

## Conventions & Practices

- **Async/Await:** All route handlers use `express-async-handler` for error propagation.
- **Validation:** Request validation is handled in `middlewares/validator.middleware.js` and related files.
- **Error Responses:** Always use `ApiError` for custom error messages.
- **Password Reset:** Codes are hashed and stored, sent via email, and verified before allowing password change.
- **Role Checks:** Use `allowedTo` middleware for admin/manager-only routes.
- **Logging:** Use `utils/logger.utils.js` for custom logging.
- **Postman:** API collections and environments are in `postman/` for manual and automated API testing.

## Integration Points

- **MongoDB:** Connection config in `config/database.js`.
- **Stripe:** Payment logic in `services/order.service.js` and related files.
- **Email:** Utility in `utils/sendEmail.utils.js`.
- **Image Upload:** Handled in `middlewares/uploadImage.middleware.js`.

## Examples

- To add a new resource, create a model, service, route, and update relevant middleware/utilities.
- For new endpoints, follow the pattern in `routes/` and `services/` (async handler, validation, error handling).

---

For questions about unclear conventions or missing documentation, ask the user for clarification or examples from their workflow.
