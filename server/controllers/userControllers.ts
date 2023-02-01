import asyncHandler from "express-async-handler";
import { Request } from "express";
import User from "../models/userModel";
import generateToken from "../config/generateToken";
import { TokenRequest } from "../middleware/authMiddleware";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("请输入所有表单");
  }

  const isUserExit = await User.findOne({ email });

  if (isUserExit) {
    res.status(400);
    throw new Error("用户已存在");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("创建用户失败");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("email 或密码错误");
  }
});

const allUsers = asyncHandler(
  async (req: Request<{}, {}, TokenRequest>, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({
      _id: { $ne: req.body.user._id },
    });
    res.send(users);
    console.log(keyword);
  }
);

export { registerUser, authUser, allUsers };
