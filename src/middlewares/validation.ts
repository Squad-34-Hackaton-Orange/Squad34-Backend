import { NextFunction, Request, Response } from "express"
import { Schema } from "yup"

const validate = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    }catch(err: any){
        res.status(400).send({message: "Invalid data."})
    }
}

export default validate;