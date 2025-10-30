import { Request, Response, NextFunction } from "express";
import { body, query, param, validationResult } from "express-validator";

import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import { getUserById } from "../../services/authService";
import { checkUserExist, checkUserNotExist } from "../../utils/auth";
import { getOrSetCache } from "../../utils/cache";
import {
  getCategoryList,
  getProductList,
  getProductWithRelations,
  getTypeList,
} from "../../services/productService";
import { checkModelNotExist } from "../../utils/check";
import {
  addProductToFavourite,
  removeProductFromFavourite,
} from "../../services/userService";
import cacheQueue from "../../jobs/queues/cacheQueue";

interface CustomRequest extends Request {
  userId?: number;
}

export const getProduct = [
  param("id", "Product Id is required.").isInt({ gt: 0 }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const productId = req.params.id;
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const cachedKey = `products:${JSON.stringify(productId)}`;
    const product = await getOrSetCache(cachedKey, async () => {
      return await getProductWithRelations(+productId, user!.id);
    });

    checkModelNotExist(product);

    res.status(200).json({ message: "Product Detail", product });
  },
];

export const getProductsByPagination = [
  query("cursor", "Cursor must be Product Id.").isInt({ gt: 0 }).optional(),
  query("limit", "Limit should not be  singed integer.")
    .isInt({ gt: 3 })
    .optional(),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const lastCursor = req.query.cursor;
    const limit = req.query.limit || 5;
    const category = req.query.category;
    const type = req.query.type;

    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    let categoryList: number[] = [];
    let typeList: number[] = [];

    if (category) {
      categoryList = category
        .toString()
        .split(",")
        .map((c) => Number(c))
        .filter((c) => c > 0);
    }

    if (type) {
      typeList = type
        .toString()
        .split(",")
        .map((t) => Number(t))
        .filter((t) => t > 0);
    }
    const where = {
      AND: [
        categoryList.length > 0 ? { categoryId: { in: categoryList } } : {},
        typeList.length > 0 ? { typeId: { in: typeList } } : {},
      ],
    };

    const options = {
      where,
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        status: true,
        images: {
          select: {
            id: true,
            path: true,
          },
          take: 1, //Only take the first photo
        },
      },
      orderBy: {
        id: "desc",
      },
    };

    // const posts = await getPostList(options);
    const cachedKey = `products:${JSON.stringify(req.query)}`;
    const products = await getOrSetCache(cachedKey, async () => {
      return await getProductList(options);
    });

    const hasNextPage = products.length > +limit;

    if (hasNextPage) {
      products.pop();
    }

    const nextCursor =
      products.length > 0 ? products[products.length - 1].id : null;

    res.status(200).json({
      message: "Get All Infinite Posts",
      hasNextPage,
      nextCursor,
      prevCursor: lastCursor,
      products,
    });
  },
];

export const getCategoryType = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserNotExist(user);

  const categories = await getCategoryList();
  const types = await getTypeList();

  res.status(200).json({ message: "Categories & Types", categories, types });
};

export const toggleFavourite = [
  body("productId", "Product Id must not be empty.").isInt({ gt: 0 }),
  body("favourite", "Favourite must not be empty.").isBoolean(),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const { productId, favourite } = req.body;

    if (favourite) {
      await addProductToFavourite(user!.id, productId);
    } else {
      await removeProductFromFavourite(user!.id, productId);
    }

    await cacheQueue.add(
      "invalidate-product-cache",
      {
        pattern: "products:*",
      },
      {
        jobId: `invalidate-${Date.now()}`,
        priority: 1,
      }
    );

    res.status(200).json({
      message: favourite
        ? "Successfully added Product to Favourite."
        : "Successfully added Product from Favourite.",
    });
  },
];
