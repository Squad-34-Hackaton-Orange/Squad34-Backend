"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateKey = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const getPrivateKey = () => {
    console.log('iniciando Private Key gerador');
    const PRIVATE_KEY = fs_1.default.readFileSync("./.env", "utf8");
    return PRIVATE_KEY;
};
exports.getPrivateKey = getPrivateKey;
function default_1(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('authUser ', req.body);
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        try {
            const PRIVATE_KEY = (_a = process.env.PRIVATE_KEY) !== null && _a !== void 0 ? _a : '';
            const token = (_b = req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "");
            if (!token) {
                return res.status(401).json({ message: "The token wasn't provided" });
            }
            const decoded = jsonwebtoken_1.default.verify(token, PRIVATE_KEY);
            const userIdFromToken = decoded.id;
            let userId;
            if (req.params.userId) {
                userId = req.params.userId;
            }
            if (req.body.id_user) {
                userId = req.body.id_user;
            }
            if (req.body.data) {
                userId = req.body.data.id_user;
            }
            if (req.query.userId) {
                userId = req.query.userId;
            }
            if (userIdFromToken !== userId) {
                return res.status(403).json({ message: "You don't have permission." });
            }
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ message: "Invalid token provided" });
        }
    });
}
exports.default = default_1;
