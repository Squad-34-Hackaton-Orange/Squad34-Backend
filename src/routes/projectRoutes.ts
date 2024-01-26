import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";

const router = Router();

//CREATE
router.post('/', ProjectController.CreateProject)

// localhost.com:8080/project/

//READ
router.get('/user/:userId', ProjectController.GetAllUserProjects);

router.get("/:projectId", ProjectController.GetProjectById);

// READ ALL
router.get('/', ProjectController.GetAllProjects);

//DELETE
router.delete('/:projectId', ProjectController.DeleteProject);

//UPDATE
router.put('/:projectId', ProjectController.updateProject);


export default router