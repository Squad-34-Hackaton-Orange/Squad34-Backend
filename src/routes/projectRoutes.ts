import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import authUser from "../middlewares/authUser";
import validateProject from "../middlewares/projectValidation";

const router = Router();

//CREATE
router.post('/', authUser, validateProject, ProjectController.CreateProject)

//READ
router.get('/:userId?', authUser, ProjectController.GetAllUserProjects);

// READ ALL
router.get('/:userId/all', authUser, ProjectController.GetAllProjects);

router.get("/:userId/:projectId", authUser, ProjectController.GetProjectById);

//DELETE
router.delete('/:userId/:projectId', authUser, validateProject, ProjectController.DeleteProject);

//UPDATE
router.put('/:projectId', authUser, validateProject, ProjectController.UpdateProject);


export default router;