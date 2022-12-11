const mongoose = require("mongoose");

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    postLink: { type: String, trim: true, required: true, unique: true },
    date: { type: String, trim: true },
    image: { type: String, trim: true, required: true },
    source: { type: String, trim: true, required: true },
    sourceLink: { type: String, trim: true },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", NewsSchema);
