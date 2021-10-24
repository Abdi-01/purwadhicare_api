const { db } = require("../database");
const request = require("request");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  getProvince: (req, res) => {
    const scriptQuery = "SELECT * FROM province;";
    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  getCity: (req, res) => {
    const scriptQuery = `SELECT * FROM city WHERE idprovince = ${req.params.id};`;
    db.query(scriptQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  getOngkir: (req, res) => {
    const { destination, weight } = req.body;
    console.log(destination, weight);
    const options = {
      method: "POST",
      url: "https://api.rajaongkir.com/starter/cost",
      headers: { key: process.env.RAJAONGKIR_KEY, "content-type": "application/x-www-form-urlencoded" },
      form: { origin: "22", destination, weight: Math.ceil(weight), courier: "jne" },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      $results = JSON.parse(body);
      res.status(200).send($results["rajaongkir"].results);
      console.log($results["rajaongkir"].results);
    });
  },
};
