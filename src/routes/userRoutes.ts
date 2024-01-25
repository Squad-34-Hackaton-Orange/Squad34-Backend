import {Router} from "express";
import { UserController } from "../controllers/UserController";

const router = Router();

//CREATE
router.post('/sign', UserController.CreateUser)

// localhost.com:8080/user/sign

//READ
router.get('/')

//UPDATE
router.put('/:UserId', UserController.updateUserById)

//DELETE
router.delete('/')




export default router