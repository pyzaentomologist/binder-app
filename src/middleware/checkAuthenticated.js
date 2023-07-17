function checkAuthenticated(req, res, next) {
  if (
    req.isAuthenticated() ||
    req.path === "/login" ||
    req.path === "/register"
  ) {
    return next();
  }
  res.redirect("/login");
}

module.exports = checkAuthenticated;
