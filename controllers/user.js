import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendToken } from "../utils/sendToken.js";

export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(new ErrorHandler("please enter all the fields ", 404));
  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("Email already registered", 404));
  // const hashedPassword = await bcrypt.hash(password, 10);
  // hashed password ka function humne models me banaya hai
  user = await User.create({ name, email, password });
  sendToken(user, res, "Registered Successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("please enter all the fields", 404));
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Email or Password", 404));
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler("password dosent match", 404));
  sendToken(user, res, `Welcome back ${user.name}`, 200);
});

export const getmyprofile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
      sameSite: "none",
      secure: true,
    })
    .json({
      success: true,
      message: "LoggedOut Successfully",
    });
});

export const updateprofile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Profile Updated Successfully",
  });
});

// change password
export const changePassword = catchAsyncError(async (req, res, next) => {
  // pehele old aur new password dono le lete hai
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("please ENter all fields", 404));

  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new ErrorHandler("Incorrect Old Password", 404));
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password Chnaged Successfully",
  });
});
