const express = require("express");
const Controller = require("../controllers");
const router = express();

router.get("/", Controller.home);
router.get("/login", Controller.login);
router.get("/register", Controller.register);

module.exports = router;
