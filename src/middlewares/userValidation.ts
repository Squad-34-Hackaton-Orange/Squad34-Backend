import { NextFunction, Request, Response } from "express"
import userSchema from "../models/userValidationSchema"

const validateUser = async (req: Request, res: Response, next: NextFunction) => {
    try{

        let signUp
        if(req.body.password) signUp = true
        userSchema.validateSync({
            body: req.body,
            query: req.query,
            params: req.params
        }, {context: { isSignUp: signUp } })
        next()

    }catch(err: any){
        res.status(400).send({message: "Invalid data."})
    }
}

export default validateUser;