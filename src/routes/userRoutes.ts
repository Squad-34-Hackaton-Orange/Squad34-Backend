import {Router} from "express";
import { UserController } from "../controllers/UserController";
import authUser from "../middlewares/authUser";

const router = Router();

//CREATE
router.post('/sign', UserController.CreateUser)
router.post('/login', UserController.LoginUser)

// localhost.com:8080/user/sign

//READ
router.get('/:userId', authUser, UserController.GetUser);

//UPDATE
router.put('/:UserId', authUser, UserController.updateUserById)

//DELETE
router.delete('/:UserId', authUser, UserController.DeleteUserById)




export default router