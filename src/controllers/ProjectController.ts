import { Request, Response } from "express";
import { prisma, PrismaError } from "../utils/prisma";

export class ProjectController {
    static async CreateProject(req: Request, res: Response) {
        const { title, description, link, id_user } = req.body;

        if (!title || !description || !link || !id_user) {
            res.status(400).send({
                message: "Invalid Data.",
            });

            return;
        }

        try {
            const project = await prisma.project.create({
                data: {
                    title,
                    description,
                    link,
                    id_user: Number(id_user),
                },
            });

            res.status(201).send({message: "Project Created Successfully."});
        } catch (error) {
            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send(error);
            }

            throw error;
        }
    }

    static async GetAllUserProjects(req: Request, res: Response): Promise<void> {
        const { userId } = req.query;

        const user = await prisma.user.findFirst({
            where: {
              id: Number(userId),
            },
            select: {
              id: true,
            },
        });

        if (!user) {
            res.status(404).send({
              message: "User doesn't exist.",
            });
            return;
          }

        try {
            const userProjects = await prisma.project.findMany({
                where: {
                    id_user: Number(userId),
                },
            });
            res.status(200).json(userProjects);
        } catch (error) {
            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send(error);
            }

            throw error;
        }
    }

    static async GetAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await prisma.project.findMany();
            res.status(200).json(projects);
        } catch (error) {
            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send(error);
            }

            throw error;
        }
    };

    static async DeleteProject(req: Request, res: Response) {
        const { projectId } = req.params;

        const project = await prisma.project.findUnique({
            where: {
                id: Number(projectId),
            },
        });

        if (!project) {
            res.status(404).send({
                message: "Project not found",
            });
            return;
        }

        try {
            await prisma.project.delete({
                where: {
                    id: Number(projectId),
                },
            });

            res.status(200).send({
                message: "Project Deleted.",
            });
        } catch (error) {
            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send({
                    message: "Internal Server Error.",
                });
            }
            throw error;
        }
    };

    static async UpdateProject(req: Request, res: Response) {
        const { projectId } = req.params;

        // CHECA SE PROJETO EXISTE NO BD

        const project = await prisma.project.findUnique({
            where: {
                id: Number(projectId),
            },
        });

        if (!project) {
            res.status(404).send({
                message: "Project not found",
            });
            return;
        }

        // PEGA INFORMAÇÕES DO PROJETO NO BODY
        const { title, description, link } = req.body;

        const updatedProject = {
            //date_post: new Date(),  PERGUNTAR SE VAI ATUALIZAR A DATA DO POST QUANDO ATUALIZAR O PROJETO
            title: title ? title : project.title,
            description: description ? description : project.description,
            link: link ? link : project.link,
        };

        //RETORNA PROJETO ATUALIZADO
        try {

            await prisma.project.update({
                where: { id: Number(projectId) },
                data: updatedProject,
            });

            res.status(200).send({
                message: "Project Updated Sucessfully.",
            });

            return;
        } catch (error) {
            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send({
                    message: "Internal Server Error.",
                });
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
              message: "Project not found.",
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






