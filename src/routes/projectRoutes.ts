import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import authUser from "../middlewares/authUser";

const router = Router();

//CREATE
router.post('/', authUser, ProjectController.CreateProject)

//READ
router.get('/?user=:userId', authUser, ProjectController.GetAllUserProjects);

// READ ALL
router.get('/all', authUser, ProjectController.GetAllProjects);

router.get("/:projectId", authUser, ProjectController.GetProjectById);

//DELETE
router.delete('/:projectId', authUser, ProjectController.DeleteProject);

//UPDATE
router.put('/:projectId', authUser, ProjectController.UpdateProject);


export default router