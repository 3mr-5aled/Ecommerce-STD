# Postman Collection for E-Commerce API

This directory contains a comprehensive Postman collection for testing all API endpoints of the E-Commerce API with pre-configured dummy data.

## Files

- `postman-collection.json` - Complete Postman collection with all API endpoints
- `postman-environment.json` - Environment variables for the collection
- `README-POSTMAN.md` - This documentation file

## How to Import

### 1. Import Collection

1. Open Postman
2. Click **Import** button
3. Select `postman-collection.json`
4. Click **Import**

### 2. Import Environment

1. Click the **Environments** tab in Postman
2. Click **Import**
3. Select `postman-environment.json`
4. Click **Import**

### 3. Set Environment

1. Select "E-Commerce API Environment" from the environment dropdown in the top-right corner

## Collection Structure

The collection is organized into the following folders:

### 🔐 Authentication

- User Signup
- User Login
- Admin Login
- Forgot Password
- Verify Reset Code
- Reset Password

### 📂 Categories

- Get All Categories
- Get Category by ID
- Create Category (Admin)
- Update Category (Admin)
- Delete Category (Admin)

### 📋 SubCategories

- Get All SubCategories
- Get SubCategories by Category
- Get SubCategory by ID
- Create SubCategory (Admin)
- Update SubCategory (Admin)
- Delete SubCategory (Admin)

### 🏷️ Brands

- Get All Brands
- Get Brand by ID
- Create Brand (Admin)
- Update Brand (Admin)
- Delete Brand (Admin)

### 📦 Products

- Get All Products
- Get Products with Filters
- Get Product by ID
- Create Product (Admin)
- Update Product (Admin)
- Delete Product (Admin)

### 👥 Users

- Get All Users (Admin)
- Get User by ID
- Create User (Admin)
- Update User
- Change User Password
- Get My Profile
- Update My Profile
- Change My Password
- Delete My Account
- Delete User (Admin)

### ⭐ Reviews

- Get All Reviews
- Get Product Reviews
- Get Review by ID
- Create Review
- Update Review
- Delete Review

### ❤️ Wishlist

- Get My Wishlist
- Add Product to Wishlist
- Remove Product from Wishlist

### 📍 Addresses

- Get My Addresses
- Add Address
- Remove Address

### 🎫 Coupons

- Get All Coupons (Admin)
- Get Coupon by ID
- Create Coupon (Admin)
- Update Coupon (Admin)
- Delete Coupon (Admin)

### 🛒 Cart

- Get My Cart
- Add Product to Cart
- Update Cart Item Quantity
- Remove Item from Cart
- Clear Cart
- Apply Coupon to Cart

### 📋 Orders

- Get All Orders
- Get Order by ID
- Create Cash Order
- Get Checkout Session (Stripe)
- Update Order to Paid (Admin)
- Update Order to Delivered (Admin)

## Usage Instructions

### Step 1: Authentication

1. **Start with User Signup** or **Admin Login**
2. The collection will automatically save the auth token from successful login/signup
3. All subsequent requests will use this token automatically

### Step 2: Create Basic Data (Admin Required)

Run these requests in order to create test data:

1. **Create Category** (Electronics)
2. **Create SubCategory** (Smartphones)
3. **Create Brand** (Apple)
4. **Create Product** (iPhone 14 Pro)

The collection will automatically save IDs from created resources for use in other requests.

### Step 3: Test User Features

With products created, test user features:

1. **Add Product to Cart**
2. **Add Product to Wishlist**
3. **Create Review**
4. **Add Address**
5. **Create Cash Order**

## Environment Variables

The collection uses these variables that are automatically set:

- `baseUrl` - API base URL (default: http://localhost:8000)
- `authToken` - JWT token (set automatically on login)
- `userId` - Current user ID
- `categoryId` - Last created category ID
- `subCategoryId` - Last created subcategory ID
- `brandId` - Last created brand ID
- `productId` - Last created product ID
- `reviewId` - Last created review ID
- `couponId` - Last created coupon ID
- `cartId` - Current cart ID
- `orderId` - Last created order ID

## Test Data Examples

### User Data

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "+201234567890"
}
```

### Product Data

```json
{
  "title": "iPhone 14 Pro",
  "description": "Latest iPhone with advanced camera",
  "quantity": 50,
  "price": 999.99,
  "priceAfterDiscount": 899.99,
  "colors": ["Deep Purple", "Gold", "Silver"],
  "category": "{{categoryId}}",
  "brand": "{{brandId}}"
}
```

### Order Data

```json
{
  "shippingAddress": {
    "details": "123 Main Street, Apartment 4B",
    "phone": "+201234567890",
    "city": "Cairo",
    "postalCode": "12345"
  }
}
```

## Tips for Testing

1. **Always authenticate first** - Most endpoints require authentication
2. **Create dependencies in order** - Categories before SubCategories, etc.
3. **Check the Tests tab** - Many requests have scripts that save response data
4. **Use filters on products** - Try different query parameters
5. **Test error cases** - Try invalid IDs or unauthorized access

## Common Issues

1. **401 Unauthorized** - Make sure you're logged in and token is set
2. **403 Forbidden** - Some actions require admin role
3. **404 Not Found** - Check that the resource ID exists
4. **400 Bad Request** - Validate request body format and required fields

## Environment Setup

Make sure your API server is running on `http://localhost:8000` or update the `baseUrl` variable accordingly.

For different environments (staging, production), create additional environment files with different base URLs.

Happy Testing! 🚀
