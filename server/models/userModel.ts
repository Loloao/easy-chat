import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true },
    passward: { type: String, require: true },
    pic: {
      type: String,
      require: true,
      default: "https://freesvg.org/img/abstract-user-flat-4.png",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
