import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
    minLength: [3, "Name must contains atleast 3 charachter"],
    maxLength: [20, "Name must contains less than 20 charachter"],
  },
  email: {
    type: String,
    required: [true, "Email must be provided"],
    unique: [true, "user already exists"],
    validate: [validator.isEmail, "Provide a valid email"],
  },
  phone: {
    type: Number,
    required: [true, "Phone must be provided"],
  },
  password: {
    type: String,
    required: [true, "Password must be provided"],
    minLength: [3, "Password must contains atleast 3 charachter"],
    maxLength: [32, "Password must contains less than 32 charachter"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.getJWT = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
export const User = mongoose.model("User", userSchema);
