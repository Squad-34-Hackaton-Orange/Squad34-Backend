import { Request, Response, NextFunction } from "express"
import jwt, { Secret, JwtPayload } from "jsonwebtoken"
import fs from 'fs';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const getPrivateKey = () => {
    const PRIVATE_KEY: Secret = fs.readFileSync('./.env', 'utf8');

    return PRIVATE_KEY;
}

export default async function (req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({ message: "No token provided" })
    }


    try {
        const privateKey = getPrivateKey()

        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: "The token wasn't provided" });
        }

        const decoded = jwt.verify(token, privateKey) as JwtPayload;

        const userIdFromToken = decoded.id;

        let userId;

        if (req.params.userId) {
            userId = req.params.userId;
        }
        else if (req.body.id_user) {
            userId = req.body.id_user;
        }
        else {
            userId = req.query.userId;
        }

        if (userIdFromToken !== userId) {
            return res.status(403).json({ message: "You don't have permission to update this user" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token provided" });
    }

}