import express from "express";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("olá World");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
