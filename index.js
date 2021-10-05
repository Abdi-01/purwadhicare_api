const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const bearerToken = require("express-bearer-token");
const PORT = process.env.PORT;
const app = express();
const db = require("./database");

app.use(cors());
app.use(express.json());
app.use(bearerToken());

db.connect((err) => {
  if (err) return console.log(err);

  console.log(`Connected with my SQL`);
});

const { userRouter } = require("./routers");

app.use("/user", userRouter);

app.listen(PORT, () => console.log("Api Running :", PORT));
