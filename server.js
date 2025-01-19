import dotenv from ".dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import user from "./routes/userRoute.js";
import profile from "./routes/userRoute.js";
import course from "./routes/courseRoute.js";
import payment from "./routes/paymentRoute.js";
import {mongoConnection} from "./config/db.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded, { extends: true });
app.use(cors);
app.use(cookieParser());
const limiter = rateLimit({
	   windowMs: 15 * 60 * 1000, 
	   limit: 100,
	   standardHeaders: 'draft-8', 
	   legacyHeaders: false, 

})
app.use("/api/v1/", user);
app.use("/api/v1/", profile);
app.use("/api/v1/", course);
app.use("/api/v1/",limiter, payment);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  mongoConnection();
  console.log(`Example app listening on port ${port}`);
});
