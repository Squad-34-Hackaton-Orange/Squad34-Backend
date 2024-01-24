import express from "express";
import { routes } from "./routes";

const app = express();
const port = 8080;

app.use(express.json())

app.get("/", (req, res) => {
  res.send("olá World");
});

// ESTA FUNÇÃO SERV TODAS AS ROTAS
routes(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
