const jwt = require("jsonwebtoken");
const models = require("../models");
const bcrypt = require("bcrypt");
const { errorHandler, withTransaction } = require("../util");
const { HttpError } = require("../error");

const register = errorHandler(
  withTransaction(async (req, res, session) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const userDoc = models.User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const refreshTokenDoc = models.RefreshToken({
      owner: userDoc.id,
    });

    await userDoc.save({ session });
    await refreshTokenDoc.save({ session });

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(userDoc.id);

    return {
      id: userDoc.id,
      accessToken,
      refreshToken,
    };
  })
);

const login = errorHandler(
  withTransaction(async (req, res, session) => {
    const userDoc = await models.User.findOne({ email: req.body.email })
      .select("+password")
      .exec();
    if (!userDoc) {
      throw new HttpError(401, "Wrong username or password");
    }

    await verifyPassword(req.body.password, userDoc.password);

    const refreshTokenDoc = models.RefreshToken({
      owner: userDoc.id,
    });
    await refreshTokenDoc.save({ session });

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id);
    const accessToken = createAccessToken(userDoc.id);

    return {
      id: userDoc.id,
      accessToken,
      refreshToken,
    };
  })
);

const newRefreshToken = errorHandler(
  withTransaction(async (req, res, session) => {
    const currentRefreshToken = await validateRefreshToken(
      req.body.refreshToken
    );
    const refreshTokenDoc = models.RefreshToken({
      owner: currentRefreshToken.userId,
    });
    await refreshTokenDoc.save({ session });

    await models.RefreshToken.deleteOne(
      { _id: currentRefreshToken.tokenId },
      { session }
    );

    const refreshToken = createRefreshToken(
      currentRefreshToken.userId,
      refreshTokenDoc.id
    );
    const accessToken = createAccessToken(currentRefreshToken.userId);

    console.log(currentRefreshToken, refreshTokenDoc, accessToken);
    return {
      id: currentRefreshToken.userId,
      accessToken,
      refreshToken,
    };
  })
);

const newAccessToken = errorHandler(
  withTransaction(async (req, res) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    const accessToken = createAccessToken(refreshToken.userId);
    return {
      id: refreshToken.userId,
      accessToken,
      refreshToken: req.body.refreshToken,
    };
  })
);

const logout = errorHandler(
  withTransaction(async (req, res, session) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    await models.RefreshToken.deleteOne(
      { _id: refreshToken.tokenId },
      { session }
    );
    return { success: true };
  })
);

const logoutAll = errorHandler(
  withTransaction(async (req, res, session) => {
    const refreshToken = await validateRefreshToken(req.body.refreshToken);
    await models.RefreshToken.deleteMany(
      { owner: refreshToken.userId },
      { session }
    );
    return { success: true };
  })
);

function createAccessToken(userId) {
  return jwt.sign(
    {
      userId: userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "10s",
    }
  );
}

function createRefreshToken(userId, refreshTokenId) {
  return jwt.sign(
    {
      userId: userId,
      tokenId: refreshTokenId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

const verifyPassword = async (plaintextPassword, hashedPassword) => {
  if (await bcrypt.compare(plaintextPassword, hashedPassword)) {
  } else {
    throw new HttpError(401, "Wrong username or password");
  }
};

const validateRefreshToken = async (token) => {
  const decodeToken = () => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new HttpError(401, "Unathorised");
    }
  };

  const decodedToken = decodeToken();
  const tokenExists = await models.RefreshToken.exists({
    _id: decodedToken.tokenId,
    owner: decodedToken.userId,
  });
  if (tokenExists) {
    return decodedToken;
  } else {
    throw new HttpError(401, "Unauthorised");
  }
};

module.exports = {
  register,
  login,
  newRefreshToken,
  newAccessToken,
  logout,
  logoutAll,
};
