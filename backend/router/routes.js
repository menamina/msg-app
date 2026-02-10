const express = require("express");
const router = express.Router();
const remote = require("../controls/remote");
const validators = require("../middleware/validators");
const passport = require("../passport/passport");
const isAuth = require("../middleware/isAuth");

router.post("/signup", validators, remote.signUp);

router.get("/isThereASession", isAuth, (req, res) => {
  res.json({ user: req.user });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        message: info.message,
      });
    }

    req.login(user, (err) => {
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
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

router.get("/hub", isAuth, remote.getUserProfile);
router.post("/sendMsg", isAuth, remote.sendMsg);
