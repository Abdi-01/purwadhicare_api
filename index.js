const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h4>Welcome to your-api</h4>");
});

const { productRouter } = require("./routers");
const { profileRouter } = require("./routers");
const { db } = require("./database");

app.use("/product", productRouter);
app.use("/profile", profileRouter);

app.listen(PORT, () => console.log("Api Running :", PORT));
