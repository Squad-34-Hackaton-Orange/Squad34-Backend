import { Request, Response } from "express";
import { prisma, PrismaError } from "../utils/prisma";

export class TagController {
  static async CreateTag(req: Request, res: Response) {
    const { name } = req.body;

    if (!name) {
      res.status(400).send({
        message: "Invalid Data",
      });

      return;
    }

    try {
      await prisma.tag.create({
        data: {
          name,
        },
      });

      res.status(201);
    } catch (error) {
      if (error instanceof PrismaError.PrismaClientKnownRequestError) {
        res.status(500).send(error);
      }

      throw error;
    }
  };

  static async GetTag(req: Request, res: Response): Promise<void> { };

  static async DeleteTag(req: Request, res: Response) { };

  static async updateTag(req: Request, res: Response) { };
};
