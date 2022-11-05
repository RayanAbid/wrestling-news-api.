const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  this.updated = Date.now(); // update the date every time a blog post is saved
  next();
});

module.exports = mongoose.model("Users", UserSchema);
