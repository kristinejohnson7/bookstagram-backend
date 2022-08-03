const mongoose = require("mongoose");
const slugify = require("slugify");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add title"],
    trim: true,
    unique: false,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  description: {
    type: String,
    maxlength: [500, "Description cannot be more than 500 characters"],
  },
  photo: {
    type: String,
    required: [true, "Please enter a photo"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: Array,
    default: [],
  },
});

PostSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Post", PostSchema);
