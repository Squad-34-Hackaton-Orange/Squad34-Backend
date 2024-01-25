import express from "express";
import { routes } from "./routes";
import dotenv from 'dotenv'

const app = express();
const port = 8080;

app.use(express.json())
dotenv.config()

app.get("/", (req, res) => {
  res.send("Hello World");
});

// ESTA FUNÇÃO SERV TODAS AS ROTAS
routes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
