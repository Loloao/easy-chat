import mongoose, { Model, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
  name: string;
  email: string;
  password: string;
  pic?: string;
}

interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<Boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    pic: {
      type: String,
      default: "https://freesvg.org/img/abstract-user-flat-4.png",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.method("matchPassword", async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
});

userSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  if (this.password) this.password = await bcrypt.hash(this.password, salt);
});

const User = model<IUser, UserModel>("User", userSchema);

export default User;
