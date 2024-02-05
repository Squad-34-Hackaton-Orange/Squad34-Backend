import { Request, Response } from "express";
import { prisma, PrismaError } from "../utils/prisma";

export class ProjectController {
    static async CreateProject(req: Request, res: Response) {
        //tags = array containing the tags ids
        const { title, description, link, id_user, tags, image } = req.body;


        //Checking if we haven't received the needed data
        if (!title || !description || !link || !id_user) {
            res.status(400).send({
                message: "Invalid Data.",
            });

            return;
        }

        //Converting timezone to Brasilia time
        const nowDate = new Date()
        nowDate.setHours(nowDate.getHours() - 3)

        try {
            const project = await prisma.project.create({
                data: {
                    title,
                    description,
                    link,
                    id_user: Number(id_user),
                    image,
                    date_post: nowDate.toISOString()
                },
            });

            if(tags){
                //Associating tags to the created project
                const projectTags = await prisma.projectTag.createMany({
                    data: tags.map((tagId: Number) => ({
                        id_project: project.id,
                        id_tag: tagId
                    }))
                })
            }

            res.status(201).send({ message: "Project Created Successfully." });

        } catch (error) {
            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send(error);
            }

            throw error;
        }
    }

    static async GetAllUserProjects(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;

        const user = await prisma.user.findFirst({
            where: {
                id: Number(userId),
            },
            select: {
                id: true,
            },
        });

        //Checking if the user doesn't exist in DB
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
                include: {
                    user: true,
                    ProjectTag: true
                }
            });
            res.status(200).json(userProjects);

        } catch (error) {
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

            //Checking if the project doesn't exist in DB
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

    static async GetProjectsByTag(req: Request, res: Response): Promise<void> {
        const { userId, tagId } = req.params

        try {
            const projects = await prisma.project.findMany({
                where: {
                    ProjectTag: {
                        some: {
                            id_tag: Number(tagId),
                        }
                    },
                    id_user: Number(userId)
                },
                include:{
                    ProjectTag: true
                }
            });

            //Checking if there's no project that matches the tags in DB
            if (!projects) {
                res.status(404).json({
                    message: "Project not found.",
                });
                return;
            }

            res.status(200).json(projects);

        } catch (error) {
            if (error instanceof PrismaError.PrismaClientKnownRequestError) {
                res.status(500).send(error);
            }

            throw error;
        }
    }

    static async GetAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const projects = await prisma.project.findMany({
                include: {
                    user: true
                }
            });
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

        //Checking if the project doesn't exist in DB
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
    }

    static async UpdateProject(req: Request, res: Response) {
        const { projectId } = req.params;
        //updateDate is a boolean that tells if the user wants to update the date_post or not
        const { title, description, link, image, updateDate } = req.body;

        const project = await prisma.project.findUnique({
            where: {
                id: Number(projectId),
            },
        });

        //Checking if the project doesn't exist in DB
        if (!project) {
            res.status(404).send({
                message: "Project not found",
            });
            return;
        }

        //Converting timezone to Brasilia time
        const newDate = new Date()
        newDate.setHours(newDate.getHours() - 3)

        const updatedProject = {
            date_post: updateDate ? newDate.toISOString() : project.date_post,
            image: image? image: project.image,
            title: title ? title : project.title,
            description: description ? description : project.description,
            link: link ? link : project.link,
        };

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
}






