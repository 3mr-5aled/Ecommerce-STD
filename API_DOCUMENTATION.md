# E-Commerce API Documentation

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations with image upload
- **Category & Brand Management**: Hierarchical organization
- **Shopping Cart**: Add, remove, update cart items
- **Order Management**: Create orders, payment integration with Stripe
- **Review System**: Product reviews and ratings
- **Wishlist**: Save favorite products
- **Email Integration**: Password reset, notifications
- **Rate Limiting**: Protection against abuse
- **Security**: XSS protection, data sanitization, CORS, HPP

## 📋 API Endpoints

### Authentication
```
POST /api/v1/auth/signup          # User registration
POST /api/v1/auth/login           # User login
POST /api/v1/auth/forgotPassword  # Request password reset
POST /api/v1/auth/verifyResetCode # Verify reset code
PUT  /api/v1/auth/resetPassword   # Reset password
```

### Users
```
GET    /api/v1/users              # Get all users (Admin)
POST   /api/v1/users              # Create user (Admin)
GET    /api/v1/users/:id          # Get specific user
PUT    /api/v1/users/:id          # Update user
DELETE /api/v1/users/:id          # Delete user (Admin)
GET    /api/v1/users/getMe        # Get logged user data
PUT    /api/v1/users/updateMe     # Update logged user data
DELETE /api/v1/users/deleteMe     # Deactivate logged user
```

### Categories
```
GET    /api/v1/categories         # Get all categories
POST   /api/v1/categories         # Create category (Admin)
GET    /api/v1/categories/:id     # Get specific category
PUT    /api/v1/categories/:id     # Update category (Admin)
DELETE /api/v1/categories/:id     # Delete category (Admin)
```

### Products
```
GET    /api/v1/products           # Get all products
POST   /api/v1/products           # Create product (Admin)
GET    /api/v1/products/:id       # Get specific product
PUT    /api/v1/products/:id       # Update product (Admin)
DELETE /api/v1/products/:id       # Delete product (Admin)
```

### Cart
```
POST   /api/v1/cart               # Add product to cart
GET    /api/v1/cart               # Get logged user cart
PUT    /api/v1/cart/:itemId       # Update cart item quantity
DELETE /api/v1/cart/:itemId       # Remove item from cart
DELETE /api/v1/cart               # Clear cart
POST   /api/v1/cart/applyCoupon   # Apply coupon to cart
```

### Orders
```
POST   /api/v1/orders/:cartId     # Create cash order
GET    /api/v1/orders             # Get all orders
GET    /api/v1/orders/:id         # Get specific order
PUT    /api/v1/orders/:id/pay     # Update order to paid (Admin)
PUT    /api/v1/orders/:id/deliver # Update order to delivered (Admin)
GET    /api/v1/orders/checkout-session/:cartId # Get checkout session
```

## 🛠️ Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example config.env
   # Edit config.env with your configuration
   ```

4. **Start the application**
   ```bash
   # Development
   npm run start:dev
   
   # Production
   npm start
   ```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🔧 Development Tools

```bash
# Linting
npm run lint
npm run lint:fix

# Code formatting
npm run format
```

## 📁 Project Structure

```
├── config/              # Configuration files
├── middlewares/         # Custom middleware
├── models/              # Mongoose models
├── routes/              # Express routes
├── services/            # Business logic
├── utils/               # Utility functions
├── validators/          # Request validation
├── uploads/             # File uploads
├── tests/               # Test files
├── logs/                # Log files
└── server.js            # Application entry point
```

## 🔐 Security Features

- **Helmet**: Security HTTP headers
- **Rate Limiting**: Prevent brute force attacks
- **CORS**: Cross-Origin Resource Sharing
- **HPP**: HTTP Parameter Pollution protection
- **XSS Clean**: Cross-site scripting protection
- **MongoDB Sanitization**: NoSQL injection prevention
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt password encryption

## 📝 Error Handling

The API implements comprehensive error handling with:
- Custom ApiError class
- Global error middleware
- Development vs Production error responses
- Async error catching with express-async-handler

## 🚀 Performance Optimizations

- **Compression**: Gzip compression for responses
- **Image Processing**: Sharp for optimized image uploads
- **Database Indexing**: Proper MongoDB indexes
- **Query Optimization**: Efficient database queries
- **Caching Strategy**: Ready for Redis implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.
