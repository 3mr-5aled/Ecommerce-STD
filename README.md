# 🛍️ Ecommerce-STD - Full Stack E-Commerce RESTful API

A comprehensive and scalable E-Commerce REST API built with Node.js, Express.js, and MongoDB. This project implements a complete e-commerce backend with modern web development practices and industry-standard features.

## 🚀 Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin, Manager, User)
- Password reset functionality
- Secure user registration and login

### 📦 Product Management

- Complete CRUD operations for products
- Product categories and subcategories
- Brand management
- Advanced search and filtering
- Product reviews and ratings
- Image upload and processing
- Inventory management

### 🛒 Shopping Experience

- Shopping cart functionality
- Wishlist management
- Coupon and discount system
- Multiple payment methods (Cash on Delivery, Online Payment)
- Order management and tracking

### 👤 User Management

- User profiles and preferences
- Address book management
- Order history
- Admin dashboard capabilities

### 🔧 Technical Features

- RESTful API design
- Data validation and sanitization
- Error handling middleware
- File upload with image processing
- Email notifications
- Rate limiting and security
- Comprehensive logging
- Unit testing

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Image Processing**: Sharp
- **Payment**: Stripe Integration
- **Email**: Nodemailer
- **Validation**: Express Validator
- **Testing**: Jest
- **Security**: Helmet, bcryptjs, express-rate-limit

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/3mr-5aled/Ecommerce-STD.git
   cd Ecommerce-STD
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `config.env` file in the root directory and add the following variables:

   ```env
   # Environment Configuration
   NODE_ENV=development
   PORT=8000

   # Database
   DB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/Ecommmerce_STD
   TEST_DB_URI=mongodb://localhost:27017/ecommerce_test

   # JWT Configuration
   JWT_SECRET_KEY=your-super-secret-jwt-key-here
   JWT_EXPIRE_TIME=90d

   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # File Upload
   MAX_FILE_SIZE=20
   UPLOAD_PATH=./uploads

   # Logging
   LOG_LEVEL=info
   ```

4. **Start the application**

   ```bash
   # Development mode
   npm run start:dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

The API provides the following main endpoints:

### Authentication

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgotPassword` - Password reset request
- `POST /api/v1/auth/resetPassword` - Reset password

### Products

- `GET /api/v1/products` - Get all products (with filtering, sorting, pagination)
- `GET /api/v1/products/:id` - Get single product
- `POST /api/v1/products` - Create product (Admin only)
- `PUT /api/v1/products/:id` - Update product (Admin only)
- `DELETE /api/v1/products/:id` - Delete product (Admin only)

### Categories

- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category (Admin only)
- `PUT /api/v1/categories/:id` - Update category (Admin only)
- `DELETE /api/v1/categories/:id` - Delete category (Admin only)

### Cart & Orders

- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart` - Add item to cart
- `PUT /api/v1/cart/:itemId` - Update cart item
- `DELETE /api/v1/cart/:itemId` - Remove item from cart
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - Get user orders

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐳 Docker Support

Run with Docker:

```bash
# Build and run with docker-compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

## 📁 Project Structure

```
├── config/                 # Configuration files
├── middlewares/            # Custom middleware functions
├── models/                 # MongoDB/Mongoose models
├── routes/                 # API route definitions
├── services/               # Business logic layer
├── utils/                  # Utility functions and helpers
├── uploads/                # File upload directory
├── tests/                  # Test files
├── postman/               # Postman collection for API testing
├── server.js              # Application entry point
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation
```

## 🔒 Security Features

- **CSRF Protection**: Cross-Site Request Forgery protection with token-based validation
- Input validation and sanitization
- SQL injection protection
- XSS protection
- Rate limiting
- CORS configuration
- Helmet for security headers
- JWT token expiration
- Password hashing with bcrypt

## 🚀 Deployment

The application is ready for deployment on platforms like:

- Heroku
- AWS EC2
- Digital Ocean
- Vercel
- Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Ahmed Khaled** - [@3mr-5aled](https://github.com/3mr-5aled)

Project Link: [https://github.com/3mr-5aled/Ecommerce-STD](https://github.com/3mr-5aled/Ecommerce-STD)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped this project grow
- Inspired by modern e-commerce platforms and best practices
- Built following Node.js and Express.js community standards

---

⭐ **Star this repository if you find it helpful!** ⭐
