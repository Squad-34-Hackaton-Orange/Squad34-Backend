import { Request, Response, NextFunction } from "express";
import { PrismaError, prisma } from "../utils/prisma";
import bcrypt from "bcrypt";
import fs from "fs";
import JWT from "jsonwebtoken";

export class UserController {
  static async CreateUser(req: Request, res: Response) {
    const { name, last_name, email, password } = req.body;

    // TODO: VERIFICAÇÕES
    if (!name || !last_name || !email || !password) {
      // TODO: TRATAR MENSAGEM
      res.status(400).send({
        menssage: "Invalid Data",
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
        menssage: "User Already Exist.",
      });

      return;
    }

    // HASH DA SENHA

    const hash = bcrypt.hashSync(password, 10);

    if (!hash) {
      res.status(500).send({
        menssage: "Internal Server Error",
      });
    }

    // CRIAÇÃO NO BANCO DE DADOS

    try {
      await prisma.user.create({
        data: {
          name,
          last_name,
          email,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        },
      });

      res.status(201).send({
        message: "User Created Sucessfuly.",
      });
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
          message: "Email ou password inválidos",
        });

        return;
      }

      const user = await prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          email: true,
          password: true,          
        },
      });

      if (!user) {
        res.status(404).send({
          message: "Usuário inexistente",
        });
        return;
      }

      const checarSenha = bcrypt.compareSync(password, user.password);

      if (!checarSenha) {
        res.status(401).send({
          message: "E-mail ou Senha Incorreta",
        });
        return;
      }

      const privateKey = fs.readFileSync("./.env").toString();

      const token = JWT.sign(
        {
          id: user.id,
        },
        privateKey,
        { expiresIn: "1h" }
      );


      res.json(token);
    } catch (error) {
      if (error instanceof PrismaError.PrismaClientKnownRequestError) {
        res.status(500).send({ message: "Internal Error" });

        throw error;
      }
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
    } catch (error) {
      if (error instanceof PrismaError.PrismaClientKnownRequestError) {
        res.status(500).send(error);
      }

      throw error;
    }
  }

  static async updateUserById(req: Request, res: Response): Promise<void> {
    const { UserId } = req.params;
    const { name, last_name, email, country } = req.body;

    const getUser = await prisma.user.findUnique({
      where: { id: Number(UserId) },
    });

    if (!getUser) {
      res.status(404).send({
        message: "User Notfound.",
      });
      return;
    }

    const updatedUser = {
      name: name ? name : getUser.name,
      last_name: last_name ? last_name : getUser.last_name,
      email: email ? email : getUser.email,
      country: country ? country : getUser.country,
      updatedAt: new Date(),
    };

    try {
      await prisma.user.update({
        where: { id: Number(UserId) },
        data: updatedUser,
      });

      res.status(200).send({
        message: "User Updated Sucessfuly.",
      });
    } catch (error) {
      res.status(500).send({
        message: "User Updated Error.",
      });
    }
  }
}
