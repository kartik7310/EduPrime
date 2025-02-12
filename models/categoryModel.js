import mongoose from "mongoose";
const SchemaCategory = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, trim: true },
  course: [{ type: mongoose.Schema.ObjectId, ref: "Course" }],

});
export const Category = mongoose.model("Category", SchemaCategory);

