# EduPrime  
EduPrime is an **Course Management System** (CMS) designed to streamline the learning experience for **teachers** and **students**. Built with a focus on **scalability**, **security**, and **feature-rich APIs**, EduPrime empowers efficient course creation, student management, and seamless interactions.  

---

## 🚀 Key Features  

### **1. Role-Based Access Control (RBAC)**  
- **Teachers**:  
  - Create, update, and delete courses.  
  - Upload media files (images, videos) for course content.  
- **Students**:  
  - Enroll in courses.  
  - Access learning materials.  
  - Submit feedback and reviews.  

### **2. Secure and Scalable Authentication**  
- **JWT Authentication**: Token-based authentication for secure API access.  
- **Password Hashing**: Implements `bcrypt` for hashing passwords before storage.  
- **Two-Factor Authentication (2FA)**:  
  - Optional 2FA via email verification with **Nodemailer**.  
- **Rate Limiting**: Protects against brute force attacks using `express-rate-limit`.  
- **Secure Cookies**: Session handling with `cookie-parser`.  

### **3. Payment Integration**  
- **Razorpay Integration**:  
  - Teachers can monetize courses by enabling paid access.  
  - Students can make secure payments to enroll in premium courses.  

### **4. Media Uploads with Cloudinary**  
- **Cloudinary Integration**:  
  - Teachers can upload course-related media securely.  
  - Cloud-based optimization and fast delivery of media assets.  

### **5. File Upload Support**  
- **express-fileupload**: Allows users to upload files such as profile pictures, documents, or course materials.  

### **6. Modular & Optimized Performance**  
- Designed with **Express.js** for a clean and maintainable REST API.  
- Utilizes **Mongoose** for seamless interaction with **MongoDB**.  
- Follows best practices for folder structure and code readability.  

---

## 🛠️ Technology Stack  

### **Backend**  
- **Node.js**: Non-blocking, event-driven runtime for fast and efficient development.  
- **Express.js**: Lightweight framework for building APIs.  
- **MongoDB**: NoSQL database for handling large datasets efficiently.  
- **Mongoose**: Schema-based Object Data Modeling (ODM) for MongoDB.  

### **Security & Authentication**  
- **bcrypt**: For hashing passwords securely.  
- **jsonwebtoken (JWT)**: Secure token-based session management.  
- **express-rate-limit**: Limits repeated requests to prevent DDoS attacks.  

### **Payment Gateway**  
- **Razorpay**: Seamless integration for payment processing.  

### **Email Management**  
- **Nodemailer**: Sends emails for **2FA**, notifications, and course updates.  

### **File & Media Management**  
- **Cloudinary**: Handles media uploads, optimization, and secure delivery.  
- **express-fileupload**: Supports file uploads (e.g., profile pictures, documents).  

---

## 🌐 Installation & Setup

### Prerequisites
1. **Node.js**: Version 14 or above.  
2. **MongoDB**: Local installation or use MongoDB Atlas.  
3. **Cloudinary**: Account for media uploads.  
4. **Razorpay**: Account for payment integration.  

---

### Step-by-Step Guide

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/eduprime.git  
cd eduprime  
2. Install Dependencies
bash
Copy
Edit
npm install  
3. Configure Environment Variables
Create a .env file in the root directory and add the following:

env
Copy
Edit
PORT=3000  
MONGO_URL=your-mongodb-connection-string  
JWT_SECRET=your-jwt-secret-key  
EMAIL_SERVICE=your-email-service  
EMAIL_USER=your-email@example.com  
EMAIL_PASSWORD=your-email-password  
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name  
CLOUDINARY_API_KEY=your-cloudinary-api-key  
CLOUDINARY_API_SECRET=your-cloudinary-api-secret  
RAZORPAY_KEY_ID=your-razorpay-key-id  
RAZORPAY_KEY_SECRET=your-razorpay-key-secret  
4. Start the Server
bash
Copy
Edit
npm start  
5. Access the Application
Navigate to http://localhost:3000 in your browser.

🔐 Two-Factor Authentication (2FA)
How It Works:
User logs in with their email and password.
A verification code is sent to their registered email.
User completes login by entering the verification code.
Note: 2FA is optional but significantly enhances account security.

🌐 Media Management with Cloudinary
Teachers can upload images or videos directly to Cloudinary for courses.
Cloudinary optimizes and serves media content via secure URLs.
💳 Payment Integration with Razorpay
EduPrime integrates Razorpay for seamless payment processing:

Premium Courses:
Students can securely pay for premium courses.

🛡️ Security Practices
EduPrime ensures the following security measures:

Password Protection:

Passwords are hashed using bcrypt.
JWT Token Security:

Tokens are signed and set to expire to prevent misuse.
Rate Limiting:

Brute-force and spam protection using express-rate-limit.
Environment Variables:

Sensitive data (e.g., API keys, secrets) is securely stored in .env.
