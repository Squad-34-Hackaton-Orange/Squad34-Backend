import { NextFunction, Request, Response } from "express";

const corsConfig = (req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "https://orangeportfolio.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
};

export default corsConfig