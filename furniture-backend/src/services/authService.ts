import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

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
