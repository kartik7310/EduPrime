# EduPrime - Learning Management System

EduPrime is a comprehensive Learning Management System (LMS) built with Node.js, Express, and MongoDB. It provides a complete platform for managing online education with features for both students and instructors.

## 🚀 Features

### Authentication & User Management
- **OTP-Based Signup**: Secure email verification using one-time passwords
- **JWT Authentication**: Secure token-based authentication with HTTP-only cookies
- **Role-Based Access Control**: Separate permissions for Students and Instructors
- **Password Management**: Change password and reset password functionality
- **User Profiles**: Extended profile information with additional details

### Course Management
- **Course Creation**: Instructors can create comprehensive courses with descriptions, pricing, and thumbnails
- **Course Structure**: Organize courses with sections and subsections
- **Course Categories**: Categorize courses for better discovery
- **Course Enrollment**: Students can browse and enroll in courses
- **Course Progress Tracking**: Track student progress through course content
- **Pagination Support**: Efficient course listing with customizable page sizes

### Payment Integration
- **Razorpay Integration**: Secure payment processing for course purchases
- **Payment Verification**: Webhook-based payment verification
- **Transaction Management**: Atomic enrollment updates using MongoDB transactions
- **Email Notifications**: Automated enrollment confirmation emails

### Rating & Review System
- **Course Ratings**: Students can rate courses they've enrolled in
- **Written Reviews**: Detailed feedback and reviews for courses
- **Average Ratings**: Calculate and display average course ratings
- **Review Aggregation**: View all reviews for better decision making

### Media & File Handling
- **Cloudinary Integration**: Cloud-based image and media storage
- **File Uploads**: Support for course thumbnails and user profile images
- **Temporary File Management**: Efficient handling of uploaded files

### Security & Performance
- **Rate Limiting**: 100 requests per 15 minutes per IP address
- **Input Validation**: Zod-based schema validation
- **Password Hashing**: Bcrypt encryption for secure password storage
- **CORS Support**: Cross-Origin Resource Sharing configuration
- **Error Handling**: Centralized error handling middleware

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Validation**: Zod schema validation

### Third-Party Services
- **Payment Gateway**: Razorpay
- **Media Storage**: Cloudinary
- **Email Service**: Nodemailer (Gmail SMTP)

### Key Dependencies
- `express` - Web application framework
- `mongoose` - MongoDB object modeling
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `razorpay` - Payment processing
- `cloudinary` - Media management
- `nodemailer` - Email notifications
- `express-rate-limit` - API rate limiting
- `express-fileupload` - File upload handling
- `cookie-parser` - Cookie parsing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment configuration
- `zod` - Schema validation

## 📁 Project Structure

```
EduPrime/
├── src/                          # Main backend application
│   ├── config/                   # Configuration files
│   │   ├── cloudinary.js        # Cloudinary setup
│   │   ├── db.js                # MongoDB connection
│   │   ├── nodemailer.js        # Email configuration
│   │   └── razorpay.js          # Razorpay setup
│   ├── controllers/             # Request handlers
│   │   ├── authController.js    # Authentication logic
│   │   ├── courseController.js  # Course operations
│   │   ├── paymentController.js # Payment processing
│   │   ├── profileController.js # Profile management
│   │   ├── ratingAndReviewController.js
│   │   ├── sectionController.js
│   │   ├── subsectionController.js
│   │   ├── catogoryController.js
│   │   └── resetPasswordController.js
│   ├── middlewares/             # Custom middleware
│   │   └── authMiddleware.js    # Auth & authorization
│   ├── models/                  # Mongoose schemas
│   │   ├── userModel.js
│   │   ├── profileModel.js
│   │   ├── courseModel.js
│   │   ├── sectionModel.js
│   │   ├── subSectionModel.js
│   │   ├── categoryModel.js
│   │   ├── otpModel.js
│   │   ├── courseProgressModel.js
│   │   └── ratingAndReviewModel.js
│   ├── routes/                  # API routes
│   │   ├── userRoute.js         # User endpoints
│   │   ├── courseRoute.js       # Course endpoints
│   │   ├── profileRoute.js      # Profile endpoints
│   │   └── paymentRoute.js      # Payment endpoints
│   ├── utils/                   # Helper functions
│   ├── validations/             # Validation schemas
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js               # Application entry point
├── platform/                    # Alternative backend (Prisma)
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: v14.x or higher
- **MongoDB**: v4.x or higher (local or MongoDB Atlas)
- **npm**: v6.x or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EduPrime
   ```

2. **Navigate to the src directory**
   ```bash
   cd src
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `src` directory with the following variables:
   ```env
   # Database
   MONGODB_URL=mongodb://localhost:27017/EduPrime
   
   # Server
   PORT=8081
   NODE_ENV=development
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   # Email Configuration
   MAIL_HOST=smtp.gmail.com
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_app_specific_password
   
   # Razorpay
   RAZORPAY_KEY=your_razorpay_key
   RAZORPAY_SECRETE=your_razorpay_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   
   # Cloudinary
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   FOLDER_NAME=EduPrime
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm start
   
   # Production mode
   node server.js
   ```

7. **Verify the server is running**
   ```
   Server is running on port 8081
   ```

## 🔗 API Overview

The API is versioned and available at `/api/v1/`:

- **User Routes** (`/api/v1/user`) - Authentication and user management
- **Course Routes** (`/api/v1/course`) - Course operations and management
- **Profile Routes** (`/api/v1/profile`) - User profile operations
- **Payment Routes** (`/api/v1/payment`) - Payment processing


## 🧪 Testing

The API includes rate limiting (100 requests per 15 minutes). You can test endpoints using:

- **Postman**: Import the API collection
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds of 10
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Zod schema validation
- **CORS Configuration**: Controlled cross-origin requests
- **Environment Variables**: Sensitive data protection





---
