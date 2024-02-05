"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const authUser_1 = __importDefault(require("../middlewares/authUser"));
const projectValidation_1 = __importDefault(require("../middlewares/projectValidation"));
const router = (0, express_1.Router)();
//CREATE
router.post('/', authUser_1.default, projectValidation_1.default, ProjectController_1.ProjectController.CreateProject);
//READ
router.get('/:userId?', authUser_1.default, ProjectController_1.ProjectController.GetAllProjects);
//READ ALL
router.get('/:userId/all', authUser_1.default, ProjectController_1.ProjectController.GetAllUserProjects);
//READ BY PROJECT ID
router.get("/:userId/:projectId", authUser_1.default, ProjectController_1.ProjectController.GetProjectById);
//READ PROJECTS BY TAG
router.get("/:userId/tag/:tagId", authUser_1.default, ProjectController_1.ProjectController.GetProjectsByTag);
//DELETE
router.delete('/:userId/:projectId', authUser_1.default, ProjectController_1.ProjectController.DeleteProject);
//UPDATE
router.put('/:projectId', authUser_1.default, projectValidation_1.default, ProjectController_1.ProjectController.UpdateProject);
exports.default = router;
