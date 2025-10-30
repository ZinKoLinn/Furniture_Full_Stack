import { Request, Response, NextFunction } from "express";
import { body, query, param, validationResult } from "express-validator";

import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import { getUserById } from "../../services/authService";
import { checkUserNotExist } from "../../utils/auth";
import { getPostList, getPostWithRelation } from "../../services/postService";
import { getOrSetCache } from "../../utils/cache";
import { checkModelNotExist } from "../../utils/check";

interface CustomRequest extends Request {
  userId?: number;
}

export const getPost = [
  param("id", "Post Id is required.").isInt({ gt: 0 }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const postId = req.params.id;
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const cachedKey = `posts:${JSON.stringify(postId)}`;
    const post = await getOrSetCache(cachedKey, async () => {
      return await getPostWithRelation(+postId);
    });

    checkModelNotExist(post);

    res.status(200).json({ message: "Post Detail", post });
  },
];

export const getPostsByPagination = [
  query("page", "Page should not be singed integer.")
    .isInt({ gt: 0 })
    .optional(),
  query("limit", "Limit should not be  singed integer.")
    .isInt({ gt: 4 })
    .optional(),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const skip = (+page - 1) * +limit;

    const options = {
      skip,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        updatedAt: true,
        author: {
          select: {
            fullName: true,
          },
        },
      },
      take: +limit + 1,
      orderBy: {
        updatedAt: "desc",
      },
    };

    const cachedKey = `posts:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cachedKey, async () => {
      return await getPostList(options);
    });

    const hasNextPage = posts.length > +limit;
    let nextPage = null;
    const previousPage = +page !== 1 ? +page - 1 : null;

    if (hasNextPage) {
      posts.pop();
      nextPage = +page + 1;
    }

    res.status(200).json({
      message: "Get All Posts",
      previousPage,
      page,
      hasNextPage,
      nextPage,
      posts,
    });
  },
];

export const getInfinitePostsByPagination = [
  query("cursor", "Cursor must be Post Id.").isInt({ gt: 0 }).optional(),
  query("limit", "Limit should not be  singed integer.")
    .isInt({ gt: 2 })
    .optional(),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const lastCursor = req.query.cursor;
    const limit = req.query.limit || 5;

    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const options = {
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        updatedAt: true,
        author: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    };

    // const posts = await getPostList(options);
    const cachedKey = `posts:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cachedKey, async () => {
      return await getPostList(options);
    });

    const hasNextPage = posts.length > +limit;

    if (hasNextPage) {
      posts.pop();
    }

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    res.status(200).json({
      message: "Get All Infinite Posts",
      hasNextPage,
      nextCursor,
      prevCursor: lastCursor,
      posts,
    });
  },
];
