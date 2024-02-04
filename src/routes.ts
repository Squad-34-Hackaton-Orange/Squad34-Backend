import {Express} from 'express';
import userRoutes from './routes/userRoutes'
import projectRoutes from './routes/projectRoutes'
import tagRoutes from './routes/tagRoutes'
import swaggerUI from 'swagger-ui-express'
import swaggerDocs from './swagger.json'

export function routes(app:Express){

  app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocs, {explorer: true}))
  app.use('/user', userRoutes)
  app.use('/project', projectRoutes)
  app.use('/tag', tagRoutes)

}