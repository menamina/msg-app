const express = require("express");
const router = express.Router();
const remote = require("../controls/remote");
const validators = require("../middleware/validators");
const passport = require("../passport/passport");

router.post(
  "/login",
  passport.authicate("local", {
    successRedirect: "/hub",
    failureRedirect: "/login",
  }),
);
router.post("/signup", validators, remote.signUp);
router.post("/signout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// home route will be REST API
// login + sign up REST API
// logout REST API?

// everything else : http api ??
