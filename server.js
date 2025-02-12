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
import fileUpload from "express-fileupload";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors()); 
app.use(cookieParser());
app.use(fileUpload({useTempFiles:true,tempFileDir:"/tmp"}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true, 
  legacyHeaders: false, 
});
app.use(limiter);
app.use("/api/v1/user", user);
app.use("/api/v1/profile", profile);
app.use("/api/v1/course", course);
app.use("/api/v1/payment", payment);


mongoConnection();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
