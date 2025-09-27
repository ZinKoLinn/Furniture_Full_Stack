import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import { createOrUpdateSettingStatus } from "../../services/settingService";

export const setMaintenance = [
  body("mode", "Mode must be boolean!").isBoolean(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { mode } = req.body;
    const value = mode ? "true" : "false";
    const message = mode
      ? "Successfully set Maintenence mode."
      : "Successfully turn off Maintenance mode";
    await createOrUpdateSettingStatus("maintenance", value);
    res.status(200).json({ message });
  },
];
