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
app.use(express.static("public"));

db.connect((err) => {
  if (err) return console.log(err);

  console.log(`Connected with my SQL`);
});


app.get("/", (req, res) => {
  res.status(200).send("<h4>Welcome to your-api</h4>");
});

const { userRouters } = require("./routers");
app.use("/user", userRouters);

app.listen(PORT, () => console.log("Api Running :", PORT));
