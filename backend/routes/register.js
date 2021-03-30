const express = require("express");
const commons = require("./commons");
const router = express.Router();

router.post("/register", (req, res) => {
  console.log("DEBUG: Received request to register user");

  if (
    (!req.body.uname && !req.body.upass) ||
    req.body.uname.trim() == "" ||
    req.body.upass.trim() == ""
  ) {
    return res.send({
      'status': 400,
      'message': "Username/password is required",
    });
  }

  commons.userObject.uname = req.body.uname;
  commons.userObject.upass = req.body.upass;
  delete commons.userObject.tfa;

  return res.send({
      status: 200,
      message: 'User is successful registered'
  });
});

module.exports = router;