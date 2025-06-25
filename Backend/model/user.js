import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dietaryPreferences: { type: [String], default: [] },
  allergies: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  otp: String, // hashed OTP
  otpExpiry: Date,
});

export const User = mongoose.model('User', userSchema);