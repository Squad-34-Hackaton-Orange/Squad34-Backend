"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authUser_1 = __importDefault(require("../middlewares/authUser"));
const TagController_1 = require("../controllers/TagController");
const router = (0, express_1.Router)();
router.get("/:userId?", authUser_1.default, TagController_1.TagController.GetTags);
exports.default = router;
