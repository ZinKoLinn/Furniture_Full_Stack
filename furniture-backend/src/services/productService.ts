import { prisma } from "./prismaClient";

export const createOneProduct = async (data: any) => {
  const productData: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    inventory: data.inventory,
    category: {
      connectOrCreate: {
        where: { name: data.category },
        create: {
          name: data.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: data.type },
        create: { name: data.type },
      },
    },
    images: {
      create: data.images,
    },
  };
  if (data.tags && data.tags.length > 0) {
    productData.tags = {
      connectOrCreate: data.tags.map((tagName: string) => ({
        where: { name: tagName },
        create: { name: tagName },
      })),
    };
  }

  return prisma.product.create({ data: productData });
};

export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      images: true,
    },
  });
};

export const updateOneProduct = async (productId: number, data: any) => {
  const productData: any = {
    name: data.name,
    description: data.description,
    price: data.price,
    discount: data.discount,
    inventory: data.inventory,
    category: {
      connectOrCreate: {
        where: { name: data.category },
        create: {
          name: data.category,
        },
      },
    },
    type: {
      connectOrCreate: {
        where: { name: data.type },
        create: { name: data.type },
      },
    },
  };
  if (data.images && data.images.length > 0) {
    productData.images = {
      deleteMany: {},
      create: data.images,
    };
  }
  if (data.tags && data.tags.length > 0) {
    productData.tags = {
      set: [],
      connectOrCreate: data.tags.map((tagName: string) => ({
        where: { name: tagName },
        create: { name: tagName },
      })),
    };
  }
  return prisma.product.update({
    where: { id: productId },
    data: productData,
  });
};

export const deleteOneProduct = async (productId: number) => {
  return prisma.product.delete({
    where: { id: productId },
  });
};

export const getProductWithRelations = async (id: number, userId: number) => {
  return prisma.product.findUnique({
    where: { id },
    omit: {
      categoryId: true,
      typeId: true,
      updatedAt: true,
      createdAt: true,
    },
    include: {
      images: {
        select: {
          id: true,
          path: true,
        },
      },
      users: {
        where: {
          id: userId,
        },
        select: {
          id: true,
        },
      },
    },
  });
};

export const getProductList = async (options: any) => {
  return prisma.product.findMany(options);
};

export const getCategoryList = async () => {
  return prisma.category.findMany();
};

export const getTypeList = async () => {
  return prisma.type.findMany();
};
