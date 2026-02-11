const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkPassword } = require("../middleware/password");
const prisma = require("../prisma/client");

const strategy = new LocalStrategy({ usernameField: "email" }, verifyCB);

function verifyCB(email, password, done) {
  prisma.user
    .findUnique({ where: { email } })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: "invalid email" });
      }
      return checkPassword(password, user.saltedHash).then((match) => {
        if (!match) {
          return done(null, false, { message: "invalid password" });
        }
        return done(null, user);
      });
    })
    .catch((err) => done(err));
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

passport.use(strategy);

module.exports = passport;
