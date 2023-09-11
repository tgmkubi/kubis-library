const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CustomError = require("../helpers/error/CustomError");
const crypto = require('crypto');

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

//Methods
UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;

  const payload = {
    name: this.name,
    id: this._id,
  };

  const secretOrPrivateKey = JWT_SECRET_KEY;

  const options = {
    expiresIn: JWT_EXPIRE,
  };

  const token = jwt.sign(payload, secretOrPrivateKey, options);

  return token;
};

UserSchema.methods.getResetPasswordFromUser = function () {
  const randomHexString = crypto.randomBytes(15).toString("hex");
  // console.log(randomHexString);

  const resetPasswordToken = crypto
  .createHash("SHA256")
  .update(randomHexString)
  .digest("hex");

  this.resetPasswordToken = resetPasswordToken;
  const {RESET_PASSWORD_EXPIRE} = process.env;
  this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

  return resetPasswordToken;
};

// Hooks
//Password Hash With Bcryptjs (Usage - Async)
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(new CustomError("Bcrypt password error", 404));
    }
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(new CustomError("Bcrypt password error", 404));
      }
      // Store hash in your password DB.
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
