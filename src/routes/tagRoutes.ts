import { Router } from "express";
import authUser from "../middlewares/authUser";
import { TagController } from "../controllers/TagController";

const router = Router()

router.get("/:userId?", authUser, TagController.GetTags)

export default router