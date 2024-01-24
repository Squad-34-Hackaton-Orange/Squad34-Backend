import {Express} from 'express';
import userRoutes from './routes/userRoutes'

export function routes(app:Express){

  app.use('/user', userRoutes)  
}