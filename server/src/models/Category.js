import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subcategories: {
    type: [String], // Array of strings
  },
});

categorySchema.pre("save", function (next) {
  if (!this.subcategories.includes("All")) {
    this.subcategories.unshift("All");
  }
  next();
});

export default mongoose.model("Category", categorySchema);
