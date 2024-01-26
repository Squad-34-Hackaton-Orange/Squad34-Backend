import {Router} from "express";
import { ProjectController } from "../controllers/ProjectController";

const router = Router();

//CREATE
router.post('/', ProjectController.CreateProject)

// localhost.com:8080/project/

//READ
router.get('/user/:userId', ProjectController.GetAllUserProjects);

router.get("/:projectId", ProjectController.GetProjectById);

//UPDATE
//router.put('/:UserId', UserController.updateUserById)

//DELETE
//router.delete('/:UserId', UserController.DeleteUserById)

export default router