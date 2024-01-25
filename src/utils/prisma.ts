import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const PrismaError = Prisma