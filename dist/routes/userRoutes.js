"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const authUser_1 = __importDefault(require("../middlewares/authUser"));
const userValidation_1 = __importDefault(require("../middlewares/userValidation"));
const router = (0, express_1.Router)();
//CREATE
router.post('/sign', userValidation_1.default, UserController_1.UserController.CreateUser);
router.post('/login', UserController_1.UserController.LoginUser);
router.post('/google/login', UserController_1.UserController.HandleUserGoogle);
// localhost.com:8080/user/sign
//READ
router.get('/:userId', authUser_1.default, UserController_1.UserController.GetUser);
//UPDATE
router.put('/:userId', authUser_1.default, userValidation_1.default, UserController_1.UserController.updateUserById);
router.put('/:userId/image', authUser_1.default, UserController_1.UserController.updateUserById);
//DELETE
router.delete('/:userId', authUser_1.default, UserController_1.UserController.DeleteUserById);
exports.default = router;
