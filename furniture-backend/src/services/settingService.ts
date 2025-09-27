import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const getSettingStatus = (key: string) => {
  return prisma.setting.findUnique({
    where: { key },
  });
};

export const createOrUpdateSettingStatus = (key: string, value: string) => {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};
