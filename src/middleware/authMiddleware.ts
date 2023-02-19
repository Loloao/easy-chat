import jwt from "jsonwebtoken";
import User from "../models/userModel";
import asyncHandler from "express-async-handler";
import { Request } from "express";

export interface TokenRequest {
  user: any;
}

const protect = asyncHandler(
  async (req: Request<any, any, TokenRequest>, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_TOKEN!);

        req.body.user = await User.findById(
          (decoded as jwt.JwtPayload).id
        ).select("-password");

        next();
      } catch (error) {
        res.status(401);
        throw new Error("无法验证用户，请登录");
      }
    }

    if (!token) {
      res.status(401);
      throw new Error("用户 token 验证失败");
    }
  }
);

export { protect };
