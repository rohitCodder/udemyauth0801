import mongoose from "mongoose";
import bcrypt from "bcrypt";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: "String",
    required: true,
    unique: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// save karne ke pehele ye function run honga
userSchema.pre("save", async function (next) {
  // agar password wala field modified nhi hai uss case me hum simple next ko return kar dena hai
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  // this.password = matlab jo database me password already hai wo
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", userSchema);
