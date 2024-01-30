import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import authUser from "../middlewares/authUser";
import validate from "../middlewares/validation";
import projectSchema from "../utils/projectValidationSchema";

const router = Router();

//CREATE
router.post('/', authUser, validate(projectSchema), ProjectController.CreateProject)

//READ
router.get('/:userId?', authUser, ProjectController.GetAllUserProjects);

// READ ALL
router.get('/:userId/all', authUser, ProjectController.GetAllProjects);

router.get("/:userId/:projectId", authUser, ProjectController.GetProjectById);

//DELETE
router.delete('/:userId/:projectId', authUser, validate(projectSchema), ProjectController.DeleteProject);

//UPDATE
router.put('/:projectId', authUser, validate(projectSchema), ProjectController.UpdateProject);


export default router;