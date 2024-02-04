import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import authUser from "../middlewares/authUser";
import validateProject from "../middlewares/projectValidation";

const router = Router();

//CREATE
router.post('/', authUser, validateProject, ProjectController.CreateProject)

//READ
router.get('/:userId?', authUser, ProjectController.GetAllProjects);

//READ ALL
router.get('/:userId/all', authUser, ProjectController.GetAllUserProjects);

//READ BY PROJECT ID
router.get("/:userId/:projectId", authUser, ProjectController.GetProjectById);

//READ PROJECTS BY TAG
router.get("/:userId/tag/:tagId", authUser, ProjectController.GetProjectsByTag)

//DELETE
router.delete('/:userId/:projectId', authUser, ProjectController.DeleteProject);

//UPDATE
router.put('/:projectId', authUser, validateProject, ProjectController.UpdateProject);


export default router;