"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const prisma_1 = require("../utils/prisma");
class ProjectController {
    static CreateProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //tags = array containing the tags ids
            const { title, description, link, id_user, tags, image } = req.body;
            //Checking if we haven't received the needed data
            if (!title || !description || !link || !id_user) {
                res.status(400).send({
                    message: "Invalid Data.",
                });
                return;
            }
            try {
                const project = yield prisma_1.prisma.project.create({
                    data: {
                        title,
                        description,
                        link,
                        id_user: Number(id_user),
                        image
                    },
                });
                if (tags) {
                    //Associating tags to the created project
                    const projectTags = yield prisma_1.prisma.projectTag.createMany({
                        data: tags.map((tagId) => ({
                            id_project: project.id,
                            id_tag: tagId
                        }))
                    });
                }
                res.status(201).send({ message: "Project Created Successfully." });
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send(error);
                }
                throw error;
            }
        });
    }
    static GetAllUserProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const user = yield prisma_1.prisma.user.findFirst({
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
                const userProjects = yield prisma_1.prisma.project.findMany({
                    where: {
                        id_user: Number(userId),
                    },
                    include: {
                        user: true,
                        ProjectTag: true
                    }
                });
                res.status(200).json(userProjects);
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send(error);
                }
                throw error;
            }
        });
    }
    static GetProjectById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            try {
                const project = yield prisma_1.prisma.project.findUnique({
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
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send(error);
                }
                throw error;
            }
        });
    }
    static GetProjectsByTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, tagId } = req.params;
            try {
                const projects = yield prisma_1.prisma.project.findMany({
                    where: {
                        ProjectTag: {
                            some: {
                                id_tag: Number(tagId),
                            }
                        },
                        id_user: Number(userId)
                    },
                    include: {
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
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send(error);
                }
                throw error;
            }
        });
    }
    static GetAllProjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const projects = yield prisma_1.prisma.project.findMany({
                    include: {
                        user: true
                    }
                });
                res.status(200).json(projects);
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send(error);
                }
                throw error;
            }
        });
    }
    ;
    static DeleteProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            const project = yield prisma_1.prisma.project.findUnique({
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
                yield prisma_1.prisma.project.delete({
                    where: {
                        id: Number(projectId),
                    },
                });
                res.status(200).send({
                    message: "Project Deleted.",
                });
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send({
                        message: "Internal Server Error.",
                    });
                }
                throw error;
            }
        });
    }
    static UpdateProject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId } = req.params;
            //updateDate is a boolean that tells if the user wants to update the date_post or not
            const { title, description, link, image, updateDate } = req.body;
            const project = yield prisma_1.prisma.project.findUnique({
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
            const updatedProject = {
                date_post: updateDate ? new Date() : project.date_post,
                image: image ? image : project.image,
                title: title ? title : project.title,
                description: description ? description : project.description,
                link: link ? link : project.link,
            };
            try {
                yield prisma_1.prisma.project.update({
                    where: { id: Number(projectId) },
                    data: updatedProject,
                });
                res.status(200).send({
                    message: "Project Updated Sucessfully.",
                });
                return;
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send({
                        message: "Internal Server Error.",
                    });
                }
                throw error;
            }
        });
    }
}
exports.ProjectController = ProjectController;
