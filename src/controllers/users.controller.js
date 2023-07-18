const { errorHandler } = require("../util");
const models = require("../models");
const { HttpError } = require("../error");

const me = errorHandler(async (req, res) => {
  const userDoc = await models.User.findById(req.userId).exec();
  if (!userDoc) {
    throw new HttpError(400, "User not found");
  }
  return userDoc;
});

const allUsers = errorHandler(async (req, res) => {
  const users = await models.User.find({}).exec();
  if (!users) {
    throw new HttpError(400, "Users not found");
  }
  try {
    res.render("users/index", {
      users: users,
    });
  } catch {
    res.redirect("/");
  }
});

const deleteUsers = errorHandler(async (req, res) => {
  const user = await models.User.findById(req.params.id).exec();
  if (!user) {
    throw new HttpError(400, "User not found");
  }
  try {
    await user.deleteOne();
    res.redirect(`/users/allUsers`);
  } catch {
    res.redirect("/");
  }
});
module.exports = {
  me,
  allUsers,
  deleteUsers,
};
