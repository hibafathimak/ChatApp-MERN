import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, unique: true },
    profilePic: { type: String, default: "" },
    bio: { type: String },
  },
  {
    timestamps: true, 
  }
);

const users = mongoose.model("users", userSchema);

export default users;
