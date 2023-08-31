const express = require("express");
const AuthController = require("../controllers/Auth");
const Student = require("../controllers/student");
const Parent = require("../controllers/parent");
const router = express();

router.get("/", AuthController.home);
router.get("/login", AuthController.login);
router.post("/login", AuthController.postLogin);
router.get("/register", AuthController.register);
router.post("/register", AuthController.postRegister);

router.get("/course", Student.viewCourse);
router.get("/course/:courseId/detail", Student.viewCourseDetail);
router.get("/course/:courseId/book", Student.bookCourseForm);
router.post("/course/:courseId/book", Student.submitCourse);

router.get("/profile/:studentId/", Student.viewStudentProfile);
router.get("/profile/:studentId/add", Student.profileForm);
router.post("/profile/:studentId/add", Student.submitProfile);

router.get("/transaction/:studentId/", Student.viewPurchasedCourse);
router.get("/transaction/:studentId/delete/:courseId", Student.deleteCourse);

router.get("/student-list/", Parent.viewStudentList);
router.get("/student-list/:studentId", Parent.viewStudentDetail);

module.exports = router;
