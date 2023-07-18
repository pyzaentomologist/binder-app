const express = require("express");
const controllers = require("../controllers");
const middlewares = require("../middlewares");
const router = express.Router();

router.get("/me", middlewares.verifyAccessToken, controllers.users.me);
router.get("/allUsers", controllers.users.allUsers);
router.delete("/:id", controllers.users.deleteUsers);

module.exports = router;
