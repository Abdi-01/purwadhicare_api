const { db } = require("../database");

module.exports = {
  getProfileData: (req, res) => {
    let profileQuery = `Select full_name, gender, email, address, age from user`;
    db.query(profileQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  addProfileData: (req, res) => {
    let { full_name, gender, email, address, age } = req.body;

    let insertProfileQuery = `Update user set full_name = ${db.escape(full_name)}, gender = ${db.escape(gender)}, email = ${db.escape(email)}, 
                              address = ${db.escape(address)}, age = ${db.escape(age)} where iduser = ${db.escape(req.params.iduser
                              )}`;

    console.log(insertProfileQuery);

    db.query(insertProfileQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  editProfileData: (req, res) => {
    let profileUpdate = [];
    for (let prop in req.body) {
      profileUpdate.push(`${prop}= ${db.escape(req.body[prop])}`);
    }
    let updateProfileQuery = `Update user set ${profileUpdate} where iduser = ${req.params.id}`;
    db.query(updateProfileQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },

  deleteProfileData: (req, res) => {
    let deleteProfileQuery = `Delete from user where iduser = ${db.escape(
      req.params.iduser
    )}`;

    db.query(deleteProfileQuery, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};
