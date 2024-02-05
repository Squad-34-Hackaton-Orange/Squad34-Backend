"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsConfig = (req, res, next) => {
    const origin = process.env.CORS_ORIGIN;
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
};
exports.default = corsConfig;
