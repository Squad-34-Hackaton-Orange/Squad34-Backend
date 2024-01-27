import {Express} from 'express';
import userRoutes from './routes/userRoutes'
import projectRoutes from './routes/projectRoutes'

export function routes(app:Express){

  app.use('/user', userRoutes)
  app.use('/project', projectRoutes)
  
}