import {Request, Response, NextFunction} from "express"
import JWT from "jsonwebtoken"
import fs from 'fs';


export default async function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({message: "No token provided"})
    }

        
    try {

        const privateKey = await fs.promises.readFile('./.env', 'utf-8');

        const [, token] = authHeader.split(" ");

        const decoded = JWT.verify(token, privateKey, { algorithms: ['RS256']});

        const { id } = decoded as Token.TokenID;

        req.userID = id

    
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token provided" });
    }
    
}


