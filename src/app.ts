import express from "express";
import { routes } from "./routes";
import dotenv from 'dotenv'
import cors from 'cors';

const app = express();
const port = 8080;

app.use(express.json())
dotenv.config()
app.use(cors({ credentials: true, origin: "http://localhost:3000" }))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
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
