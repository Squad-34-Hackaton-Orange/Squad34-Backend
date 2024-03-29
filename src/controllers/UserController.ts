import { Request, Response, NextFunction } from "express";
import { PrismaError, prisma } from "../utils/prisma";
import bcrypt from "bcrypt";

import jwt, { Secret } from "jsonwebtoken";
import { getPrivateKey } from "../middlewares/authUser";
import dotenv from 'dotenv';

dotenv.config()

export class UserController {
  static async CreateUser(req: Request, res: Response) {

    
    console.log('criar usuario ',req.body)

    const { name, last_name, email, password } = req.body;


    if (!name || !last_name || !email || !password) {
      res.status(400).send({
        message: "Invalid Data",
      });

      return;
    }
    

    const checkUserExist = await prisma.user.findFirst({
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

    const hash = bcrypt.hashSync(password, 10);

    if (!hash) {
      res.status(500).send({
        message: "Internal Server Error.",
      });
    }

    // CRIAÇÃO NO BANCO DE DADOS

    //Converting timezone to Brasilia time
    const brasiliaTime = new Date()
    brasiliaTime.setHours(brasiliaTime.getHours() - 3)

    try {
      await prisma.user.create({
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
    } catch (error) {
      if (error instanceof PrismaError.PrismaClientKnownRequestError) {
        res.status(500).send(error);
      }

      throw error;
    }
  }

  static async LoginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      // CHECA SE RECEBEMOS OS DADOS
      if (!email && !password) {
        res.status(400).send({
          message: "Invalid data.",
        });

        return;
      }

      const user = await prisma.user.findFirst({
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

      const checarSenha = bcrypt.compareSync(password, user.password);

      if (!checarSenha) {
        res.status(401).send({
          message: "Invalid email or password.",
        });
        return;
      }

      if(user.deletedAt){
        res.status(401).send({message: "User has been deleted."})
        return
      }
      console.log('senha correta? ', checarSenha)

      if (checarSenha) {
        //@tsignore
        const PRIVATE_KEY: Secret = process.env.PRIVATE_KEY ?? '';


        console.log('privatekey ', PRIVATE_KEY)


        const token = jwt.sign(
          { id: user.id.toString(), name: user.name, email: user.email, last_name: user.last_name, image: user.image },
          PRIVATE_KEY,
          {
            expiresIn: "2h",
          }
        );
        console.log('token', token)
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
    } catch (error) {
      if (error instanceof PrismaError.PrismaClientKnownRequestError) {
        res.status(500).send({ message: "Internal Error." });

        throw error;
      }
    }
  }

  static async HandleUserGoogle(req: Request, res: Response) {
    const { name, last_name, email, image } = req.body;


    console.log('email', email)
    if (!name || !last_name || !email) {
      res.status(400).send({
        message: "Invalid Data",
      });

      return;
    }
    

    const checkUserExist = await prisma.user.findFirst({
      where: {
        email,
      },      
    });

    console.log('user Existe? ', checkUserExist)

    if(!checkUserExist){
      
        await prisma.user.create({
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

    const novoUser = await prisma.user.findFirst({
      where: {
        email,
      },      
    });

    console.log('User no BD ', novoUser)

    if (novoUser) {
      const PRIVATE_KEY: Secret = process.env.PRIVATE_KEY ?? '';


        const token = jwt.sign(
          { id: novoUser.id.toString(), name: novoUser.name, last_name: novoUser.last_name, email: novoUser.email, country: novoUser.country, image: novoUser.image },
          PRIVATE_KEY,
          {
            expiresIn: "2h",
          }
        );

        console.log('TOKEN: ', token)


        res.status(200).json({
          token: token,
        });

      return;
    }
  }

  static async GetUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await prisma.user.findFirst({
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
    } catch (error) {
      if (error instanceof PrismaError.PrismaClientKnownRequestError) {
        res.status(500).send(error);
      }

      throw error;
    }
  }

  static async updateUserById(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { name, last_name, email, country, image } = req.body;

    const getUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!getUser) {
      res.status(404).send({
        message: "User not found.",
      });
      return;
    }

    //Converting timezone to Brasilia time
    const newDateUser = new Date()
    newDateUser.setHours(newDateUser.getHours() - 3)

    const updatedUser = {
      name: name ? name : getUser.name,
      last_name: last_name ? last_name : getUser.last_name,
      email: email ? email : getUser.email,
      country: country ? country : getUser.country,
      image: image? image : getUser.image,
      updatedAt: newDateUser.toISOString(),
    };

    try {
      await prisma.user.update({
        where: { id: Number(userId) },
        data: updatedUser,
      });

      res.status(200).send({
        message: "User Updated Sucessfully.",
      });
      return;
    } catch (error) {
      res.status(500).send({
        message: "User Update Error.",
      });
    }
  }

  static async DeleteUserById(req: Request, res: Response) {
    const { userId } = req.params;

    const getUser = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!getUser) {
      res.status(404).send({
        message: "User not found.",
      });
      return;
    }

    //Converting timezone to Brasilia time
    const deletedUserDate = new Date()
    deletedUserDate.setHours(deletedUserDate.getHours() - 3)

    try {
      await prisma.user.update({
        where: { id: Number(userId) },
        data: { deletedAt: deletedUserDate.toISOString() },
      });

      res.status(200).send({
        message: "User Deleted Successfully.",
      });

      return;
    } catch (error) {
      if (error instanceof PrismaError.PrismaClientKnownRequestError) {
        res.status(500).send({
          message: "User Deleted Error.",
        });
      }
      throw error;
    }
  }
}