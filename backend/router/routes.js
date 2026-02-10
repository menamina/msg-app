const express = require("express");
const router = express.Router();
const remote = require("../controls/remote");
const validators = require("../middleware/validators");
const passport = require("../passport/passport");

router.post("/signup", validators, remote.signUp);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        message: info.message,
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

router.post("/signout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/hub", isAuth, remote.getUserProfile);

// home route will be REST API
// login + sign up REST API
// logout REST API?

// everything else : http api ??
