async function authVariables(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.user = await req.user;
  next();
}

module.exports = authVariables;
