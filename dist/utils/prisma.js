"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaError = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
exports.PrismaError = client_1.Prisma;
