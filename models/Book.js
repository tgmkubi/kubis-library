const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minlength : [1,"Please provide title at least 1 characters"],
    unique: true,
  },
  author: {
    type: String,
    required: [true, "author is required"],
    minlength : [4,"Please provide title at least 4 characters"],
  },
  slug: String,
  category: {
    type: String,
    required: [true, "category is required"],
  },
  quantity: {
    type: Number,
    default: 1
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  page: {
    type: Number,
  },
  language: {
    type: String,
  },
  summary: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("Book", BookSchema);
