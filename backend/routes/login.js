const express = require("express");
const speakeasy = require("speakeasy");
const commons = require("./commons");
const router = express.Router();

router.post("/login", (req, res) => {
  console.log("DEBUG: Received login request.");

  if (commons.userObject.uname && commons.userObject.upass) {
    if (!commons.userObject.tfa || !commons.userObject.tfa.secret) {
      if (
        req.body.uname == commons.userObject.uname &&
        req.body.upass == commons.userObject.upass
      ) {
        console.log("DEBUG: Login without TFA is succesful.");

        return res.send({
          status: 200,
          message: "success",
        });
      }
      console.log("ERROR: Login without TFA is not successful.");

      return res.send({
        status: 403,
        message: "Invalid username or password.",
      });
    } else {
      if (
        req.body.uname != commons.userObject.uname ||
        req.body.upass != commons.userObject.upass
      ) {
        console.log("ERROR with TFA is not successful.");

        return res.send({
          status: 403,
          message: "Inavlid username or password",
        });
      }

      if (!req.headers["x-tfa"]) {
        console.log("WARNING: Login was partial without TFA header.");

        return res.send({
          status: 206,
          message: "Please enter the auth code",
        });
      }

      let isVerify = speakeasy.totp.verify({
        secret: commons.userObject.tfa.secret,
        encoding: "base32",
        token: req.headers["x-tfa"],
      });

      if (isVerify) {
        console.log("DEBUG: Login with TFA is verified to be successful.");

        return res.send({
          status: 200,
          message: "Success",
        });
      } else {
        console.log("ERROR: Invalid auth code.");

        return res.send({
          status: 206,
          message: "Invalid auth code",
        });
      }
    }
  }

  return res.send({
    status: 404,
    message: "Please register to login",
  });
});

module.exports = router;
