const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(express.static("public"));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h4>Welcome to your-api</h4>");
});
const { userRouters } = require("./routers");
app.use("/users", userRouters);

app.listen(PORT, () => console.log("Api Running :", PORT));
