const express = require("express");
const router = express();
const AuthController = require("../controllers/Auth");
const Student = require("../controllers/student");
const Parent = require("../controllers/parent");
const Tes = require("../controllers/tes");
const Swal = require("sweetalert2");

router.get("/", AuthController.home);
router.get("/login", AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/register", AuthController.register);
router.post("/register", AuthController.postRegister);

module.exports = router;
