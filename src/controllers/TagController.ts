import { Request, Response } from "express";
import { prisma, PrismaError } from "../utils/prisma";

export class TagController {
    static async GetTags(req: Request, res: Response){
        try{
            const tags = await prisma.tag.findMany()
            res.status(200).json(tags)
            
        }catch (error) {
            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send(error);
            }

            throw error;
        }
    }
}






