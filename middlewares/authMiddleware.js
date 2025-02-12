import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { errorHandler } from "../utils/error.js";
const JWT_SECRET = "kartik";

export const userAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);

    if (!token) {
      return next(new errorHandler(401,"Authentication token not provided."))
    }

    // Verify token
    const decodedToken = jwt.verify(token, JWT_SECRET);

    if (!decodedToken) {
      return next(new errorHandler("Invalid token") );
    }
    
    // Attach user information to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    next(error)
  }
};

export const roleBasedAccess = (allowUser) => {
  return (req, res, next) => {
    try {
      const user = req.user; // Assuming userAuth middleware has already added req.user
      if (!user) {
       return next (new errorHandler("User details not provided.") );
      }

      // Check if user's role matches the allowed role
      if (!user.accountType) {
       return next(new errorHandler("User account type not found." ));
      }

      if (user.accountType === allowUser) {
        return next();
      }

      return res.status(403).json({
        message: `Access denied. This route is only for ${allowUser}.`,
      });
    } catch (error) {
     next(error)
    }
  };
};
