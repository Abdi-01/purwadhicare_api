const { db } = require("../database");
const request = require("request");

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
    const { destination } = req.body.params;
    const options = {
      method: "POST",
      url: "https://api.rajaongkir.com/starter/cost",
      headers: { key: "321f2bc127732001eed0301569e241c9", "content-type": "application/x-www-form-urlencoded" },
      form: { origin: "22", destination: destination, weight: 1000, courier: "jne" },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      $results = JSON.parse(body);
      res.status(200).send($results["rajaongkir"].results);
    });
  },
};
