import { disconnect } from "process";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient().$extends({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`;
        },
      },
      image: {
        needs: { image: true },
        compute(user) {
          if (user.image) {
            return "/optimize/" + user.image.split(".")[0] + ".webp";
          }
          return user.image;
        },
      },
    },
  },
});

export const getUserByPhone = (phone: string) => {
  return prisma.user.findUnique({
    where: { phone },
  });
};

export const createOtp = (otpData: any) => {
  return prisma.otp.create({ data: otpData });
};

export const getOtpByPhone = (phone: string) => {
  return prisma.otp.findUnique({
    where: { phone },
  });
};

export const updateOtp = (id: number, otpData: any) => {
  return prisma.otp.update({
    where: { id },
    data: otpData,
  });
};

export const createUser = (userData: any) => {
  return prisma.user.create({
    data: userData,
  });
};

export const updateUser = (id: number, userUpdateData: any) => {
  return prisma.user.update({
    where: { id },
    data: userUpdateData,
  });
};

export const getUserById = (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};
