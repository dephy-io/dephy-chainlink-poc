import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

await prisma.$connect();

export const db = prisma;

export const initKey = async (
  key: string,
  defaultValue: Prisma.InputJsonValue
) => {
  const curr = await db.config.count({ where: { key } });
  if (!curr) {
    await db.config.create({
      data: {
        key,
        value: defaultValue,
      },
    });
  }
};

export const getKey = async <T>(key: string) => {
  const i = await db.config.findUnique({ where: { key } });
  return (i as any).value as unknown as T;
};

export const setKey = async <T extends Prisma.InputJsonValue>(
  key: string,
  value: T
) => {
  const i = await db.config.update({
    where: { key },
    data: { value },
  });
  return (i as any).value as unknown as T;
};
