const { authenticate } = require("passport");

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    if (!user) {
      return done(null, false, { message: "No user with that email" });
    }

    // console.log(user, "authenticateUser");
    try {
      if (await bcrypt.compare(password, user.password)) {
        // console.log(user, "await");
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorect" });
      }
    } catch (e) {
      return done(e);
    }
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      authenticateUser
    )
  );
  passport.serializeUser((user, done) => {
    // console.log(user, "serializeUser");
    return done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    // console.log(getUserById(id), "deserializeUser");
    return done(null, getUserById(id));
  });
}

module.exports = initialize;
