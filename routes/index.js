const express = require("express");

const AuthController = require("../controllers/Auth");
const Student = require("../controllers/student");
const Parent = require("../controllers/parent");

const router = express();
const Tes = require("../controllers/tes");
const Swal = require("sweetalert2");

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
    let error = "Salah Bos";
    res.redirect(`/login?error=${error}`);
  }
};

const isParent = function (req, res, next) {
  if (req.session.userId && req.session.userRole === "Parent") {
    next();
  } else {
    Swal.fire("The Internet?", "That thing is still around?", "question");
    let error = "Salah Bos";
    res.redirect(`/login?error=${error}`);
  }
};

const isStudent = function (req, res, next) {
  if (req.session.userId && req.session.userRole === "Student") {
    next();
  } else {
    Swal.fire("The Internet?", "That thing is still around?", "question");
    let error = "Role kamu tidak sesuai";
    res.redirect(`/?error=${error}`);
  }
};
router.get("/logout", AuthController.logout);
router.get("/profile");
router.get("/student-list/", isParent, Parent.viewStudentList);
router.get("/student-list/:studentId", isParent, Parent.viewStudentDetail);
router.get('/student-list/:studentId/csv', Parent.downloadStudentCSV);

router.get("/course", isStudent, Student.viewCourse);
router.get("/course/:courseId/detail", isStudent, Student.viewCourseDetail);
router.get("/course/:courseId/book", isStudent, Student.bookCourseForm);
router.post("/course/:courseId/book", isStudent, Student.submitCourse);

router.get("/profile/:studentId/", isStudent, Student.viewStudentProfile);
router.post("/profile/:studentId/add", isStudent, Student.submitProfile);

router.get("/transaction/:studentId/", isStudent, Student.viewPurchasedCourse);
router.get("/transaction/:studentId/delete/:courseId", isStudent, Student.deleteCourse);

module.exports = router;
