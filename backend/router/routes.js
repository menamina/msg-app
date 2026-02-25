const express = require("express");
const router = express.Router();
const remote = require("../controls/remote");
const validators = require("../middleware/validators");
const passport = require("../passport/passport");
const isAuth = require("../middleware/isAuth");
const multer = require("../multer/multer");

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
    res.status(200).json({ ok: true });
  });
});

router.get("/hub", isAuth, remote.getUserProfile);
router.post("/getMsgs", isAuth, remote.getMsgs);
router.get("/pfpIMG/:image", isAuth, remote.sendIMGS);

router.get("/sideBarChatSearch/search", isAuth, remote.sideBarChatSearch);
router.get("/searchByUsername/search", isAuth, remote.friendSearch);

router.post("/sendMsg", multer.single("file"), isAuth, remote.sendMsg);
router.patch("/dltMsg", isAuth, remote.deleteMsg);

router.get("/getFriends", isAuth, remote.getFriends);

router.post("/sendFriendReq", isAuth, remote.requestFriend);
router.get("/getFriendReqs", isAuth, remote.getFriendReqs);
router.patch("/acceptFriendReq", isAuth, remote.acceptFriend);
router.delete("/denyFriendReq", isAuth, remote.denyFriend);

router.post("/dltFriend", isAuth, remote.deleteFriend);

router.patch(
  "/updateProfile",
  isAuth,
  multer.single("file"),
  remote.updateProfile,
);

module.exports = router;
