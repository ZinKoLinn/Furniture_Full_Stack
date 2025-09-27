import { Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import { unlink } from "node:fs/promises";
import path from "path";

import { errorCode } from "../../../config/errorCode";
import { authorise } from "../../utils/authorise";
import { getUserById, updateUser } from "../../services/authService";
import { checkUserExist, checkUserNotExist } from "../../utils/auth";
import { checkFileNotExist } from "../../utils/check";
import imageQuene from "../../jobs/queues/imageQueue";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}

export const changeLanguage = [
  query("lng", "Invalid Language Code.")
    .trim()
    .notEmpty()
    .matches("^[a-z]+$")
    .isLength({ min: 2, max: 3 }),
  (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    const { lng } = req.query;

    res.cookie("i18next", lng);

    res.status(200).json({ message: req.t("changeLan", { lang: lng }) });
  },
];

export const testPermission = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserNotExist(user);

  const info: any = {
    title: "Testing Permission",
  };
  const can = authorise(true, user!.role, "AUTHOR");
  if (can) {
    info.content = "You can read this line.";
  }

  res.status(200).json({ message: info });
};

export const uploadProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;

  const user = await getUserById(userId!);
  checkUserNotExist(user);
  checkFileNotExist(image);

  const fileName = image?.filename;

  if (user?.image) {
    try {
      const filePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        user!.image
      );
      await unlink(filePath);
    } catch (error) {
      console.log(error);
    }
  }

  const userData = {
    image: fileName,
  };
  await updateUser(user!.id, userData);

  res
    .status(200)
    .json({ message: "Profile is successfully uploaded", image: fileName });
};

export const getMyPhoto = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const file = path.join(
    __dirname,
    "../../../",
    "uploads/images",
    req.file!.filename
  ); //image name

  res.sendFile(file, (err) => {
    res.status(404).send("Image not Found.");
  });
};

export const uploadMultiple = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const images = req.files;
  console.log("req.files...", images);
  res.status(200).json({ message: "Multiple Images uploaded successfully." });
};

export const uploadProfileOptimize = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const image = req.file;
  const user = await getUserById(userId!);
  checkUserNotExist(user);
  checkFileNotExist(image);

  const splitFileName = image?.fieldname.split(".")[0];

  const job = await imageQuene.add(
    "image-optimize",
    {
      filePath: image!.path,
      fileName: `${splitFileName}.webp`,
      width: 200,
      height: 200,
      quality: 50,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    }
  );

  if (user!.image) {
    try {
      const originalFilePath = path.join(
        __dirname,
        "../../../",
        "uploads/images",
        user!.image
      );
      const optimizeFilePath = path.join(
        __dirname,
        "../../../",
        "uploads/optimize",
        user!.image.split(".")[0] + ".webp"
      );

      await unlink(originalFilePath);
      await unlink(optimizeFilePath);
    } catch (error) {
      console.log(error);
    }
  }

  const userData = {
    image: image?.filename,
  };
  await updateUser(user!.id, userData);

  res.status(200).json({
    message: "Profile picture successfully uploaded.",
    image: splitFileName + ".webp",
    jobId: job.id,
  });
};
