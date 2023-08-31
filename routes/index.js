const express = require("express");
const router = express();
const AuthController = require("../controllers/Auth");
const Tes = require("../controllers/tes");
const Swal = require("sweetalert2");

router.get("/", AuthController.home);
router.get("/login", AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/register", AuthController.register);
router.post("/register", AuthController.postRegister);
router.use(function (req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    Swal.fire("The Internet?", "That thing is still around?", "question");
    let error = "Login dulu bwang";
    res.redirect(`/login?error=${error}`);
  }
});

router.get("/tes", Tes.tes);

module.exports = router;
