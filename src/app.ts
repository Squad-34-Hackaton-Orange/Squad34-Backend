import express from "express";
import { routes } from "./routes";
import dotenv from 'dotenv'
import cors from 'cors';
import corsConfig from "./middlewares/corsConfig";

const app = express();
const port = 8080;
const origin = process.env.CORS_ORIGIN

app.use(express.json())
dotenv.config()

//app.use(corsConfig)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://orange-portfolio-eta.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Passa para o próximo middleware
  next();
});


app.get("/", (req, res) => {
  res.send("Hello World");
});

// ESTA FUNÇÃO SERV TODAS AS ROTAS
routes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
