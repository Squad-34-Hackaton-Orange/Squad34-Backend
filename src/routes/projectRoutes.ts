import {Router} from "express";
import { ProjectController } from "../controllers/ProjectController";

const router = Router();

//CREATE
router.post('/', ProjectController.CreateProject)

// localhost.com:8080/project/

//READ
router.get('/user/:userId', ProjectController.GetAllUserProjects);



//DELETE
//router.delete('/:UserId', UserController.DeleteUserById)







//UPDATE
router.put('/:projectId', ProjectController.updateProject)


export default router