import { NextFunction, Request, Response } from "express"
import projectSchema from "../models/projectValidationSchema"

const validateProject = async (req: Request, res: Response, next: NextFunction) => {
    try{
        await projectSchema.validate({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    }catch(err: any){
        res.status(400).send({message: "Invalid data."})
    }
}

export default validateProject;