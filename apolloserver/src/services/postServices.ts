import { prisma } from "../lib/prisma";

import type { CreatePostInput } from "../type";

export const getPosts = async () => {
  return prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getPost = async (id: string) => {
  return prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const createPost = async (Input: CreatePostInput) => {
  return prisma.post.create({
    data: {
      title: Input.title,
      content: Input.content,
      published: Input.published,
      author: {
        connect: {
          id: Input.authorId,
        },
      },
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const deletePost = async (id: string) => {
  return prisma.post.delete({ where: { id } });
};
