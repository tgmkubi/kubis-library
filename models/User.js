const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    minlength: [6, "Please provide a valid password with min length 6"],
    required: [true, "Password is required"],
    select: false,
  },
  phonenumber: {
    type: String,
    unique: true,
    match: [
      /^(05\d{2}[- ]?\d{3}[- ]?\d{4})$/,
      "Please provide a valid phone number. Ex. 05XX-XXX-XXXX",
    ],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  about: {
    type: String,
  },
  place: {
    type: String,
  },
  profile_image: {
    type: String,
  },
  blocked: {
    type: Boolean,
    default: false,
  },
  hired_books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpire: {
    type: Date,
  },
});

module.exports = mongoose.model("User", UserSchema);