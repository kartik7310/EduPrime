import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import user from "./routes/userRoute.js";
import profile from "./routes/profileRoute.js";
import course from "./routes/courseRoute.js";
import payment from "./routes/paymentRoute.js";
import { mongoConnection } from "./config/db.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Corrected syntax
app.use(cors()); // Ensure CORS middleware is invoked
app.use(cookieParser());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Inform clients about rate limits using standard headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter); // Apply rate limiter to all routes

// Routes
app.use("/api/v1/", user);
app.use("/api/v1/", profile);
app.use("/api/v1/", course);
app.use("/api/v1/", payment);

// Connect to MongoDB
mongoConnection();

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
