import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";

interface CustomRequest extends Request {
  user?: any;
}

export const getPost = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone Number should be minimum 5 and maximum 12."),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    res.status(200).json({ message: "OK" });
  },
];

export const getPostsByPagination = [
  body("phone", "Invalid Phone Number")
    .trim()
    .notEmpty()
    .matches("^[0-9]+$")
    .isLength({ min: 5, max: 12 })
    .withMessage("Phone Number should be minimum 5 and maximum 12."),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    res.status(200).json({ message: "OK" });
  },
];
