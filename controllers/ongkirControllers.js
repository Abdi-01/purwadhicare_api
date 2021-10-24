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
    const { destination, weight } = req.body;
    console.log(destination, weight);
    const options = {
      method: "POST",
      url: "https://api.rajaongkir.com/starter/cost",
      headers: {
        key: "ba486845f939be1fc43e7bbcc5b39ed4",
        "content-type": "application/x-www-form-urlencoded",
      },
      form: {
        origin: "22",
        destination,
        weight: Math.ceil(weight),
        courier: "jne",
      },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      $results = JSON.parse(body);
      res.status(200).send($results["rajaongkir"].results);
      console.log($results["rajaongkir"].results);
    });
  },
};
