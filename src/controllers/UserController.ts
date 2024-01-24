import {Request, Response, NextFunction} from 'express';
import {PrismaError, prisma} from '../utils/prisma'
import bcrypt from 'bcrypt'


export class UserController {
  static async CreateUser(req: Request, res: Response){
    const {name, last_name, email, password} = req.body;

    
    // TODO: VERIFICAÇÕES
    if(!name || !last_name || !email || !password){

      // TODO: TRATAR MENSAGEM
      res.status(400).send({
        menssage: "Invalid Data"
      })

      return;
    }


    const checkUserExist = await prisma.user.findFirst({
      where:{
        email
      },
      select: {
        email: true
      }
    })

    if(checkUserExist){
      res.status(409).send({
        menssage: "User Already Exist."
      })

      return;
    }

    // HASH DA SENHA

    const hash = bcrypt.hashSync(password, 10)

    if(!hash){
      res.status(500).send({
        menssage: "Internal Server Error"
      })      
    }

    // CRIAÇÃO NO BANCO DE DADOS

    try {

       await prisma.user.create({
         data:{
           name,
           last_name,
           email,
           password,
           createdAt: new Date(),
           updatedAt: new Date(),
           deletedAt: new Date(),
         }
       })

       res.status(201).send({
        message: "User Created Sucessfuly."
       })
      
      
      
    } catch (error) {
      
      if( error instanceof PrismaError.PrismaClientKnownRequestError){
        res.status(500).send(error)
      }

      throw error
    }
  }

}