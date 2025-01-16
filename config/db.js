import mongoose from "mongoose";
export const mongoConnection = () => {
  const mongoUrl = process.env.MONGO_URL;
  try {
    mongoose
      .connect(mongoUrl)
      .then(() =>
        console
          .log("mongodb connected")
          .catch(() => console.log("mongoDb connection failed"))
      );
  } catch (error) {
    console.log(error);
    
  }
};
