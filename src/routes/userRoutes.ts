import {Router} from "express";
import { UserController } from "../controllers/UserController";
import authUser from "../middlewares/authUser";

const router = Router();

//CREATE
router.post('/sign', UserController.CreateUser)
router.post('/login', UserController.LoginUser, authUser)

// localhost.com:8080/user/sign

//READ
router.get('/')

//UPDATE
router.put('/')

//DELETE
router.delete('/')




export default router