import { Request, Response, NextFunction } from "express";
import { getSettingStatus } from "../services/settingService";
import { createError } from "../utils/error";
import { errorCode } from "../../config/errorCode";

const whiteLists = ["127.0.0.1"];

export const maintenance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip: any = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (whiteLists.includes(ip)) {
    console.log(`Allowed ip: ${ip}`);
    next();
  } else {
    console.log(`Not Allowed ip: ${ip}`);
    const setting = await getSettingStatus("maintenance");
    if (setting?.value === "true") {
      return next(
        createError(
          "Server is currently under manintenance. Please come again later",
          503,
          errorCode.maintenance
        )
      );
    }
    next();
  }
};
