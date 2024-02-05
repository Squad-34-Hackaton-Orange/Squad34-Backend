import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import fs from "fs";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const getPrivateKey = () => {
  console.log('iniciando Private Key gerador')
  const PRIVATE_KEY: Secret = fs.readFileSync("./.env", "utf8");

  return PRIVATE_KEY;
};

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {

  console.log('authUser ',req.body)
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }


  try {
    const PRIVATE_KEY: Secret = process.env.PRIVATE_KEY ?? '';

    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "The token wasn't provided" });
    }

    const decoded = jwt.verify(token, PRIVATE_KEY) as JwtPayload;


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
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Invalid token provided" });
  }
}
