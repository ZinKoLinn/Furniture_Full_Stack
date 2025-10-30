import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import path from "path";
import { unlink } from "node:fs/promises";

import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import { checkFileNotExist, checkModelNotExist } from "../../utils/check";
import imageQuene from "../../jobs/queues/imageQueue";
import {
  createOneProduct,
  deleteOneProduct,
  getProductById,
  updateOneProduct,
} from "../../services/productService";
import cacheQueue from "../../jobs/queues/cacheQueue";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
  files?: any;
}

const removeFiles = async (
  originalFiles: string[],
  optimizedFiles: string[] | null
) => {
  try {
    for (const originalFile of originalFiles) {
      const originalFilePath = path.join(
        __dirname,
        "../../../",
        "uploads/images",
        originalFile
      );
      await unlink(originalFilePath);
    }

    if (optimizedFiles) {
      for (const optimizedFile of optimizedFiles) {
        const optimizedFilePath = path.join(
          __dirname,
          "../../../",
          "uploads/optimize",
          optimizedFile
        );
        await unlink(optimizedFilePath);
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createProduct = [
  body("name", "Name is required.").trim().notEmpty().escape(),
  body("description", "Description is required.").trim().notEmpty().escape(),
  body("price", "Price is required.")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount is required.")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("inventory", "Inventory is required.").isInt({ min: 1 }),
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
      if (req.files && req.files.length > 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFiles(originalFiles, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const {
      name,
      description,
      price,
      discount,
      inventory,
      category,
      type,
      tags,
    } = req.body;
    checkFileNotExist(req.files && req.files.length > 0);

    await Promise.all(
      req.files.map(async (file: any) => {
        const splitFileName = file.filename.split(".")[0];

        return imageQuene.add(
          "image-optimize",
          {
            filePath: file.path,
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
      })
    );

    const originalFileNames = req.files.map((file: any) => ({
      path: file.filename,
    }));

    const data = {
      name,
      description,
      price,
      discount,
      inventory: +inventory,
      images: originalFileNames,
      category,
      type,
      tags,
    };
    const product = await createOneProduct(data);

    await cacheQueue.add(
      "invalidate-product-cache",
      { pattern: "products:*" },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      }
    );

    res.status(201).json({
      message: `Successfully posted a product.`,
      productId: product.id,
    });
  },
];

export const updateProduct = [
  body("productId", "ProductID is required.").isInt({ min: 1 }),
  body("name", "Name is required.").trim().notEmpty().escape(),
  body("description", "Description is required.").trim().notEmpty().escape(),
  body("price", "Price is required.")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount is required.")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("inventory", "Inventory is required.").isInt({ min: 1 }),
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
      if (req.files && req.files.length > 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFiles(originalFiles, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const {
      productId,
      name,
      description,
      price,
      discount,
      inventory,
      category,
      type,
      tags,
    } = req.body;

    const product = await getProductById(+productId);
    if (!product) {
      if (req.files && req.files.length > 0) {
        const originalFiles = req.files.map((file: any) => file.filename);
        await removeFiles(originalFiles, null);
      }
      return next(
        createError("This model doesn't exist.", 409, errorCode.invalid)
      );
    }

    const originalFileNames = req.files.map((file: any) => ({
      path: file.filename,
    }));

    const data = {
      name,
      description,
      price,
      discount,
      inventory: +inventory,
      category,
      type,
      tags,
      images: originalFileNames,
    };

    if (req.files) {
      await Promise.all(
        req.files.map(async (file: any) => {
          const splitFileName = file.filename.split(".")[0];
          return imageQuene.add(
            "image-optimize",
            {
              filePath: file.path,
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
        })
      );

      const originalFiles = product.images.map((image) => image.path);
      const optimizedFiles = product.images.map(
        (image) => image.path.split(".")[0] + ".webp"
      );

      await removeFiles(originalFiles, optimizedFiles);
    }

    const updatedProduct = await updateOneProduct(product.id, data);
    await cacheQueue.add(
      "invalidate-product-cache",
      { pattern: "products:*" },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      }
    );
    res.status(200).json({
      message: "Successfully updated the product.",
      productId: updatedProduct.id,
    });
  },
];

export const deleteProduct = [
  body("productId", "Product Id is required.").isInt({ min: 1 }),

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    //console.log({errors: errors[0].msg});
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { productId } = req.body;
    const product = await getProductById(+productId);
    checkModelNotExist(product);

    const deletedProduct = await deleteOneProduct(product!.id);
    await cacheQueue.add(
      "invalidate-product-cache",
      { pattern: "products:*" },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      }
    );

    const originalFileNames = product!.images.map((image) => image.path);
    const optimizedFileNames = product!.images.map(
      (image) => image.path.split(".")[0] + ".webp"
    );
    await removeFiles(originalFileNames, optimizedFileNames);

    res.status(200).json({
      message: "Successfully deleted the product.",
      productId: deletedProduct.id,
    });
  },
];
