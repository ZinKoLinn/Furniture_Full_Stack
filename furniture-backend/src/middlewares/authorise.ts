import { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/authService";
import { errorCode } from "../../config/errorCode";
import { createError } from "../utils/error";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}

export const authorise = (permission: boolean, ...roles: string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await getUserById(userId!);
    if (!user) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const result = roles.includes(user!.role);

    if (permission && !result) {
      return next(
        createError(
          "You are not allowed to call this request.",
          403,
          errorCode.unauhtorised
        )
      );
    }

    if (!permission && result) {
      return next(
        createError(
          "You are not allowed to call this request.",
          403,
          errorCode.unauhtorised
        )
      );
    }

    req.user = user;
    next();
  };
};
