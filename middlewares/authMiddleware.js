import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userAuth = async (req, res, next) => {
  try {
    // Retrieve token from cookies, body, or headers
    const token = 
      req.cookies?.token || 
      req.body?.token || 
      (req.headers["authorization"] && req.headers["authorization"].split(" ")[1]);

    if (!token) {
      return res.status(400).json({ message: "Authentication token not provided." });
    }

    // Verify token
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token." });
    }

    // Attach user information to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Error while verifying token.",
      error: error.message,
    });
  }
};

export const roleBasedAccess = (allowUser) => {
  return (req, res, next) => {
    try {
      const user = req.user; // Assuming userAuth middleware has already added req.user
      if (!user) {
        return res.status(400).json({ message: "User details not provided." });
      }

      // Check if user's role matches the allowed role
      if (user.accountType === allowUser) {
        return next();
      }

      return res.status(403).json({
        message: `Access denied. This route is only for ${allowUser}.`,
      });
    } catch (error) {
      return res.status(401).json({
        message: "Error during role-based access control.",
        error: error.message,
      });
    }
  };
};
