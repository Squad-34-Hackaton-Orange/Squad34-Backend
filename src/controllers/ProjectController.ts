import { Request, Response } from "express";
import { prisma, PrismaError } from "../utils/prisma";
import { UserController } from "./UserController";

export class ProjectController{

    static async CreateProject(req: Request, res: Response){

        const { title, description, link, id_user } = req.body

        if (!title || !description || !link || !id_user) {
        
            res.status(400).send({
                message: "Invalid Data",
            });

            return;

        }

        try{

            const project = await prisma.project.create({
                data: {
                    title,
                    description,
                    link,
                    id_user
                }
            })

            res.status(201)

        }catch(error){

            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send(error);
            }
        
            throw error;

        }

    }

    static async GetAllUserProjects(req: Request, res: Response): Promise<void>{

        const {userId} = req.params

        try{
            
            const userProjects = await prisma.project.findMany({
                where: {
                    id_user: Number(userId)
                }
            })
            res.status(200).json(userProjects)

        }catch(error){

            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send(error);
            }
        
            throw error;

        }

    }

    static async GetProjectById(req: Request, res: Response): Promise<void> {


        const { projectId } = req.params;
    
        try {
          const project = await prisma.project.findUnique({
            where: {
                id: Number(projectId),
            },
          });
    
          if (!project) {
            res.status(404).json({
              message: "Project not found",
            });
            return;
          }
    
          res.status(200).json(project);

        } catch (error) {
          if (error instanceof PrismaError.PrismaClientKnownRequestError) {
            res.status(500).send(error);
          }
    
          throw error;
        }
      }
    




}