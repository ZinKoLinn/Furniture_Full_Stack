import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorCode } from "../../config/errorCode";
import { getUserById, updateUser } from "../services/authService";
import { createError } from "../utils/error";

interface CustomRequest extends Request {
  userId?: number;
}

export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    return next(
      createError(
        "You are not an authenticated user.",
        401,
        errorCode.unauthenticated
      )
    );
  }

  const generateNewtokens = async () => {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        phone: string;
      };
    } catch (error) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (isNaN(decoded.id)) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const user = await getUserById(decoded.id);
    if (!user) {
      return next(
        createError(
          "This account has not registered!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user.phone !== decoded.phone) {
      return next(
        createError(
          "This phone has not registered!",
          401,
          errorCode.unauthenticated
        )
      );
    }
    if (user.randToken !== refreshToken) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }
    const accessTokenPayLoad = { id: user.id };
    const refreshTokenPayLoad = { id: user.id, phone: user.phone };

    const newAccessToken = jwt.sign(
      accessTokenPayLoad,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 15 * 60, //15 mins
      }
    );
    const newRefreshToken = jwt.sign(
      refreshTokenPayLoad,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d", //30 days
      }
    );

    //Updating randtoken with refresh token
    const userUpdateData = {
      randToken: newRefreshToken,
    };
    await updateUser(user.id, userUpdateData);

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

    req.userId = decoded.id;
    next();
  };

  if (!accessToken) {
    generateNewtokens();
    // const error: any = new Error("Access Token has expired.");
    // error.status = 401;
    // error.code = errorCode.unauthenticated;
    // next(error);
  }

  //Verify access token
  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
      id: number;
    };

    if (isNaN(decoded.id)) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    req.userId = decoded.id;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      generateNewtokens();
      // error.message = "Access Token has expired.";
      // error.status = 401;
      // error.code = errorCode.unauthenticated;
    } else {
      error.message = "Access Token Invalid";
      error.status = 400;
      error.code = errorCode.attack;
      return next(createError("Access Token Invalid", 400, errorCode.attack));
    }
  }
};
