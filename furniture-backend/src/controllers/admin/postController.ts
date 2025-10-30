import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import path from "path";
import { unlink } from "node:fs/promises";
import sanitizeHtml from "sanitize-html";

import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import { getUserById } from "../../services/authService";
import { checkUserNotExist } from "../../utils/auth";
import { checkFileNotExist, checkModelNotExist } from "../../utils/check";
import imageQuene from "../../jobs/queues/imageQueue";
import {
  createOnePost,
  updateOnePost,
  getPostById,
  PostArgs,
  deleteOnePost,
} from "../../services/postService";
import cacheQueue from "../../jobs/queues/cacheQueue";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}

const removeFiles = async (
  originalFile: string,
  optimizedFile: string | null
) => {
  const originalFilePath = path.join(
    __dirname,
    "../../../",
    "uploads/images",
    originalFile
  );
  await unlink(originalFilePath);

  if (optimizedFile) {
    const optimizedFilePath = path.join(
      __dirname,
      "../../../",
      "uploads/optimize",
      optimizedFile
    );
    await unlink(optimizedFilePath);
  }
};

export const createPost = [
  body("title", "Title is required.").trim().notEmpty().escape(),
  body("content", "Content is required.").trim().notEmpty().escape(),
  body("body", "Body is required.")
    .trim()
    .notEmpty()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),
  body("category", "Category is required.").trim().notEmpty().escape(),
  body("type", "Type is required.").trim().notEmpty().escape(),
  body("tags", "Tag is invalid.")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: any) => tag.trim() !== " ");
      }
      return value;
    }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { title, content, body, category, type, tags } = req.body;
    // const userId = req.userId;
    const user = req.user;
    const image = req.file;
    checkFileNotExist(image);
    // const user = await getUserById(userId!);
    // if (!user) {
    //   if (req.file) {
    //     await removeFiles(req.file.filename, null);
    //   }

    //   return next(
    //     createError(
    //       "This user has not registered",
    //       401,
    //       errorCode.unauthenticated
    //     )
    //   );
    // }

    const splitFileName = req.file?.filename.split(".")[0];

    await imageQuene.add(
      "image-optimize",
      {
        filePath: req.file?.path,
        fileName: `${splitFileName}.webp`,
        width: 835,
        height: 577,
        quality: 100,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      }
    );

    const data: PostArgs = {
      title,
      content,
      body,
      image: req.file!.filename,
      authorId: user!.id,
      category,
      type,
      tags,
    };
    const post = await createOnePost(data);

    await cacheQueue.add(
      "invalidate-post-cache",
      { pattern: "posts:*" },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      }
    );

    res
      .status(201)
      .json({ message: `Successfully posted a post`, postId: post.id });
  },
];

export const updatePost = [
  body("postId", "PostId is required.").isInt({ min: 1 }),
  body("title", "Title is required.").trim().notEmpty().escape(),
  body("content", "Content is required.").trim().notEmpty().escape(),
  body("body", "Body is required.")
    .trim()
    .notEmpty()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),
  body("category", "Category is required.").trim().notEmpty().escape(),
  body("type", "Type is required.").trim().notEmpty().escape(),
  body("tags", "Tag is invalid.")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: any) => tag.trim() !== " ");
      }
      return value;
    }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { postId, title, content, body, category, type, tags } = req.body;
    const user = req.user;
    // const userId = req.userId;
    // const user = await getUserById(userId!);
    // if (!user) {
    //   if (req.file) {
    //     await removeFiles(req.file.filename, null);
    //   }

    //   return next(
    //     createError(
    //       "This user has not registered",
    //       401,
    //       errorCode.unauthenticated
    //     )
    //   );
    // }

    const post = await getPostById(+postId);
    if (!post) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }

      return next(
        createError("This data doesn't exist.", 401, errorCode.invalid)
      );
    }

    if (user.id !== post.authorId) {
      if (req.file) {
        await removeFiles(req.file.filename, null);
      }

      return next(
        createError("This action is not allowed.", 403, errorCode.unauhtorised)
      );
    }

    let data: any = {
      title,
      content,
      body,
      image: req.file,
      category,
      type,
      tags,
    };
    if (req.file) {
      data.image = req.file.filename;

      const splitFileName = req.file?.filename.split(".")[0];

      await imageQuene.add(
        "image-optimize",
        {
          filePath: req.file?.path,
          fileName: `${splitFileName}.webp`,
          width: 835,
          height: 577,
          quality: 100,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        }
      );

      const optimizedFile = post.image.split(".")[0] + ".webp";
      await removeFiles(post.image, optimizedFile);
    }

    const postUpdated = await updateOnePost(post.id, data);

    await cacheQueue.add(
      "invalidate-post-cache",
      { pattern: "posts:*" },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      }
    );

    res.status(200).json({
      message: "Successfully updated your post.",
      postId: postUpdated.id,
    });
  },
];

export const deletePost = [
  body("postId", "PostId is required.").isInt({ gt: 0 }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { postId } = req.body;
    const user = req.user;
    // const userId = req.userId;
    // const user = await getUserById(userId!);
    // checkUserNotExist(user);

    const post = await getPostById(+postId);
    checkModelNotExist(post);

    if (user!.id !== post!.authorId) {
      return next(
        createError("This action is not allowed.", 403, errorCode.unauhtorised)
      );
    }

    const deletedPost = await deleteOnePost(post!.id);

    const optimizedFile = post!.image.split(".")[0] + ".webp";
    await removeFiles(post!.image, optimizedFile);

    await cacheQueue.add(
      "invalidate-post-cache",
      { pattern: "posts:*" },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      }
    );

    res.status(200).json({
      message: "Successfully deleted your post.",
      deletedPostID: deletedPost.id,
    });
  },
];
