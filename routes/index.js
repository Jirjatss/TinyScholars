const express = require("express");

const AuthController = require("../controllers/auth");
const UserController = require("../controllers/user");
const { Swal } = require("sweetalert2");
const router = express();

router.get("/", AuthController.home);
router.get("/login", AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/register", AuthController.register);
router.post("/register", AuthController.postRegister);

const isLogin = function (req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    Swal.fire("The Internet?", "That thing is still around?", "question");
    let error = "Please Login First";
    return res.redirect(`/login?error=${error}`);
  }
};

const isParent = function (req, res, next) {
  if (req.session.userId) {
    if (req.session.userRole === "Parent") {
      next();
    } else {
      Swal.fire("The Internet?", "That thing is still around?", "question");
      let error = "Roles not Match";
      return res.redirect(`/?error=${error}`);
    }
  } else {
    Swal.fire("The Internet?", "That thing is still around?", "question");
    let error = "Please Login First";
    return res.redirect(`/login?error=${error}`);
  }
};

const isStudent = function (req, res, next) {
  if (req.session.userId) {
    if (req.session.userRole === "Student") {
      next();
    } else {
      Swal.fire("The Internet?", "That thing is still around?", "question");
      let error = "Roles not Match";
      return res.redirect(`/?error=${error}`);
    }
  } else {
    Swal.fire("The Internet?", "That thing is still around?", "question");
    let error = "Please Login First";
    return res.redirect(`/login?error=${error}`);
  }
};
router.get("/logout", AuthController.logout);

router.get("/student-list/", isParent, UserController.viewStudentList);
router.get("/student-list/:studentId", isParent, UserController.viewStudentDetail);
router.get("/student-list/:studentId/csv", UserController.downloadStudentCSV);

router.get("/course", isStudent, UserController.viewCourse);
router.get("/course/:courseId/detail", isStudent, UserController.viewCourseDetail);
router.get("/course/:courseId/book", isStudent, UserController.bookCourse);

router.get("/profile/:id", isLogin, UserController.viewProfile);
router.get("/profile/:id/add", isLogin, UserController.profileForm);
router.post("/profile/:id/add", isLogin, UserController.submitProfile);

router.get("/transaction/:studentId/", isStudent, UserController.viewPurchasedCourse);
router.get("/transaction/:studentId/attend/:transactionId", isStudent, UserController.attend);
router.get("/transaction/:studentId/cancel/:transactionId", isStudent, UserController.cancel);

module.exports = router;
