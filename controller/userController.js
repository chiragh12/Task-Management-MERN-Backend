import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

export const registerUser = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("User avatar required", 400));
  }

  const { avatar } = req.files;
  const allowedFormats = [
    "image/png",
    "image/jpeg",
    "image/avif",
    "image/webp",
  ];

  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(
      new ErrorHandler("The avatar format must be PNG, JPEG, AVIF, WEBP", 400)
    );
  }

  const { name, email, password, phone } = req.body;
  if (!name || !email || !password || !phone) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User already exists", 400));
  }

  let cloudinaryResponse;
  try {
    cloudinaryResponse = await cloudinary.uploader.upload(avatar.tempFilePath);
  } catch (error) {
    console.error("Cloudinary error:", error);
    return next(new ErrorHandler("Error uploading avatar to Cloudinary", 500));
  }
  user = await User.create({
    name,
    email,
    phone,
    password,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  sendToken(user, "User registered successfully", 200, res);
});

export const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  sendToken(user, "User Logged in successfully !", 200, res);
});
export const logoutUser = catchAsyncError((req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User Logged Out!",
    });
});
export const currentUserProfile = catchAsyncError((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User Information is given below",
    user,
  });
});
