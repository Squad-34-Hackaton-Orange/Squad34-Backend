"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const port = 8080;
const origin = process.env.CORS_ORIGIN;
app.use(express_1.default.json());
dotenv_1.default.config();
//app.use(corsConfig)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://orange-portfolio-eta.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    // Passa para o próximo middleware
    next();
});
app.get("/", (req, res) => {
    res.send("Hello World");
});
// ESTA FUNÇÃO SERV TODAS AS ROTAS
(0, routes_1.routes)(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
