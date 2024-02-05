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
exports.UserController = void 0;
const prisma_1 = require("../utils/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class UserController {
    static CreateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('criar usuario ', req.body);
            const { name, last_name, email, password } = req.body;
            if (!name || !last_name || !email || !password) {
                res.status(400).send({
                    message: "Invalid Data",
                });
                return;
            }
            const checkUserExist = yield prisma_1.prisma.user.findFirst({
                where: {
                    email,
                },
                select: {
                    email: true,
                },
            });
            if (checkUserExist) {
                res.status(409).send({
                    message: "User Already Exist.",
                });
                return;
            }
            // HASH DA SENHA
            const hash = bcrypt_1.default.hashSync(password, 10);
            if (!hash) {
                res.status(500).send({
                    message: "Internal Server Error.",
                });
            }
            // CRIAÇÃO NO BANCO DE DADOS
            //Converting timezone to Brasilia time
            const brasiliaTime = new Date();
            brasiliaTime.setHours(brasiliaTime.getHours() - 3);
            try {
                yield prisma_1.prisma.user.create({
                    data: {
                        name,
                        last_name,
                        email,
                        password: hash,
                        createdAt: brasiliaTime.toISOString(),
                    },
                });
                res.status(201).send({
                    message: "User Created Successfully.",
                });
                return;
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send(error);
                }
                throw error;
            }
        });
    }
    static LoginUser(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                // CHECA SE RECEBEMOS OS DADOS
                if (!email && !password) {
                    res.status(400).send({
                        message: "Invalid data.",
                    });
                    return;
                }
                const user = yield prisma_1.prisma.user.findFirst({
                    where: {
                        email,
                    },
                    select: {
                        id: true,
                        name: true,
                        last_name: true,
                        email: true,
                        password: true,
                        deletedAt: true,
                        image: true
                    },
                });
                if (!user) {
                    res.status(404).send({
                        message: "Invalid email or password.",
                    });
                    return;
                }
                const checarSenha = bcrypt_1.default.compareSync(password, user.password);
                if (!checarSenha) {
                    res.status(401).send({
                        message: "Invalid email or password.",
                    });
                    return;
                }
                if (user.deletedAt) {
                    res.status(401).send({ message: "User has been deleted." });
                    return;
                }
                console.log('senha correta? ', checarSenha);
                if (checarSenha) {
                    //@tsignore
                    const PRIVATE_KEY = (_a = process.env.PRIVATE_KEY) !== null && _a !== void 0 ? _a : '';
                    console.log('privatekey ', PRIVATE_KEY);
                    const token = jsonwebtoken_1.default.sign({ id: user.id.toString(), name: user.name, email: user.email, last_name: user.last_name, image: user.image }, PRIVATE_KEY, {
                        expiresIn: "2h",
                    });
                    console.log('token', token);
                    res.status(200).json({
                        user: {
                            name: user.name,
                            email: user.email,
                            id: user.id,
                        },
                        token: token,
                    });
                }
                return;
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send({ message: "Internal Error." });
                    throw error;
                }
            }
        });
    }
    static HandleUserGoogle(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, last_name, email, image } = req.body;
            console.log('email', email);
            if (!name || !last_name || !email) {
                res.status(400).send({
                    message: "Invalid Data",
                });
                return;
            }
            const checkUserExist = yield prisma_1.prisma.user.findFirst({
                where: {
                    email,
                },
            });
            console.log('user Existe? ', checkUserExist);
            if (!checkUserExist) {
                yield prisma_1.prisma.user.create({
                    data: {
                        name,
                        last_name,
                        email,
                        image,
                        password: 'ad16hs 6ky1h6 51a165d4a16f165h4r#@$!$f64af46a8d244h64g68sd4f6846h84f68g69wj4l4hjk462nd994',
                        createdAt: new Date(),
                    },
                });
            }
            const novoUser = yield prisma_1.prisma.user.findFirst({
                where: {
                    email,
                },
            });
            console.log('User no BD ', novoUser);
            if (novoUser) {
                const PRIVATE_KEY = (_a = process.env.PRIVATE_KEY) !== null && _a !== void 0 ? _a : '';
                const token = jsonwebtoken_1.default.sign({ id: novoUser.id.toString(), name: novoUser.name, last_name: novoUser.last_name, email: novoUser.email, country: novoUser.country, image: novoUser.image }, PRIVATE_KEY, {
                    expiresIn: "2h",
                });
                console.log('TOKEN: ', token);
                res.status(200).json({
                    token: token,
                });
                return;
            }
        });
    }
    static GetUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const user = yield prisma_1.prisma.user.findFirst({
                    where: { id: Number(userId) },
                    select: {
                        name: true,
                        country: true,
                        last_name: true,
                        email: true,
                        Project: true,
                        password: false,
                        createdAt: false,
                        updatedAt: false,
                        deletedAt: false,
                    },
                });
                if (!user) {
                    res.status(404).send({
                        message: "User not found",
                    });
                    return;
                }
                res.status(200).json(user);
                return user.Project;
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send(error);
                }
                throw error;
            }
        });
    }
    static updateUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const { name, last_name, email, country, image } = req.body;
            const getUser = yield prisma_1.prisma.user.findUnique({
                where: { id: Number(userId) },
            });
            if (!getUser) {
                res.status(404).send({
                    message: "User not found.",
                });
                return;
            }
            //Converting timezone to Brasilia time
            const newDateUser = new Date();
            newDateUser.setHours(newDateUser.getHours() - 3);
            const updatedUser = {
                name: name ? name : getUser.name,
                last_name: last_name ? last_name : getUser.last_name,
                email: email ? email : getUser.email,
                country: country ? country : getUser.country,
                image: image ? image : getUser.image,
                updatedAt: newDateUser.toISOString(),
            };
            try {
                yield prisma_1.prisma.user.update({
                    where: { id: Number(userId) },
                    data: updatedUser,
                });
                res.status(200).send({
                    message: "User Updated Sucessfully.",
                });
                return;
            }
            catch (error) {
                res.status(500).send({
                    message: "User Update Error.",
                });
            }
        });
    }
    static DeleteUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const getUser = yield prisma_1.prisma.user.findUnique({
                where: { id: Number(userId) },
            });
            if (!getUser) {
                res.status(404).send({
                    message: "User not found.",
                });
                return;
            }
            //Converting timezone to Brasilia time
            const deletedUserDate = new Date();
            deletedUserDate.setHours(deletedUserDate.getHours() - 3);
            try {
                yield prisma_1.prisma.user.update({
                    where: { id: Number(userId) },
                    data: { deletedAt: deletedUserDate.toISOString() },
                });
                res.status(200).send({
                    message: "User Deleted Successfully.",
                });
                return;
            }
            catch (error) {
                if (error instanceof prisma_1.PrismaError.PrismaClientKnownRequestError) {
                    res.status(500).send({
                        message: "User Deleted Error.",
                    });
                }
                throw error;
            }
        });
    }
}
exports.UserController = UserController;
