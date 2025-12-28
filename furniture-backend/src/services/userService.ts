import { prisma } from "./prismaClient";

export const addProductToFavourite = async (
  userId: number,
  productId: number
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      products: {
        connect: {
          id: productId,
        },
      },
    },
  });
};

export const removeProductFromFavourite = async (
  userId: number,
  productId: number
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      products: {
        disconnect: {
          id: productId,
        },
      },
    },
  });
};

export const getProductListWithRelation = async (
  userID: number,
  options: any
) => {
  return prisma.product.findMany({
    where: {
      users: {
        some: {
          id: userID,
        },
      },
    },
    ...options,
  });
};
