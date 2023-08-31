const express = require("express");
const AuthController = require("../controllers/Auth");
const router = express();

router.get("/", AuthController.home);
router.get("/login", AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/register", AuthController.register);
router.post("/register", AuthController.postRegister);

module.exports = router;
