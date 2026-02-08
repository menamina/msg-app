const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkPassword } = require("../middleware/password");
const prisma = require("../controls/remote");

const strategy = new LocalStrategy({ usernameField: "email" }, verifyCB);

function verifyCB(email, password, done) {
  prisma
    .findByEmail(email)
    .then((user) => {
      if (!user) {
        return done(null, false, { message: "invalid email" });
      }
      const validatePassword = checkPassword(password, user.saltedHash);
      if (!validatePassword) {
        return done(null, false, { message: "invalid password" });
      }
      return done(null, user);
    })
    .catch((err) => {
      done(err);
    });
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  prisma
    .findByID(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

passport.use(strategy);

module.exports = passport;
