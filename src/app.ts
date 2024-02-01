import express from "express";
import { routes } from "./routes";
import dotenv from 'dotenv'
import cors from 'cors';

const app = express();
const port = 8080;

app.use(express.json())
dotenv.config()
app.use(cors({ credentials: true, origin: process.env.NODE_ENV === "dev" ? "http://localhost:3000/" : "url_deploy"}))

app.get("/", (req, res) => {
  res.send("Hello World");
});

// ESTA FUNÇÃO SERV TODAS AS ROTAS
routes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
