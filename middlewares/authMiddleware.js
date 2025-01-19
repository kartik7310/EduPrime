import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    // Retrieve token from cookies, body, or headers
    const token = req.cookies?.token || req.body?.token || req.headers["authorization"].split(" ")[1] ;

    if (!token) {
      return res.status(400).json({ message: "Token not provided" });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Attach user information to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Error while verifying token",
      error: error.message,
    });
  }
};

const roleBasedAccess = async (allowUser) => {
  return async function (req, _, next) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(400).json({ message: "details not provide" });
      }
      if (user.accountType == allowUser) {
        return next();
      }
      return res.status(403).json({
        message: `Access denied. This route is only for ${allowedRole}`,
      });
    } catch (error) {
      return res
        .status(401)
        .json({ message: "these routes only for students or Instructor" });
    }
  };
};
