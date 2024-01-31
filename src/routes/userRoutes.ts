import {Router} from "express";
import { UserController } from "../controllers/UserController";
import authUser from "../middlewares/authUser";
import validateUser from "../middlewares/userValidation";

const router = Router();

//CREATE
router.post('/sign', validateUser, UserController.CreateUser)
router.post('/login', UserController.LoginUser)

// localhost.com:8080/user/sign

//READ
router.get('/:userId', authUser, UserController.GetUser);

//UPDATE
router.put('/:userId', authUser, validateUser, UserController.updateUserById)

//DELETE
router.delete('/:userId', authUser, UserController.DeleteUserById)

export default router