const { HttpError } = require("../error");
const { errorHandler } = require("../util");
const jwt = require("jsonwebtoken");

const verifyAccessToken = errorHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(jwt.verify(token, process.env.ACCESS_TOKEN_SECRET));

  if (!token) {
    throw new HttpError(401, "Unathorized");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (e) {
    throw new HttpError(401, "Unathorized");
  }
});

module.exports = {
  verifyAccessToken,
};
