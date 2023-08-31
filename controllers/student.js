const { Course, Instructor, User, UserProfile, Transaction } = require("../models");
const { Op } = require("sequelize");

class Student {
  static viewCourse(req, res) {
    const { search, schedule, sort, error } = req.query;
    const { userRole } = req.session;

    let whereOptions = {};
    if (search) {
      whereOptions.name = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (schedule) {
      whereOptions.schedule = schedule;
    }

    let orderOption = [["price", "ASC"]];
    if (sort === "desc") {
      orderOption = [["price", "DESC"]];
    }
    Course.findAll({
      where: whereOptions,
      order: orderOption,
      include: Instructor,
    })
      .then((courses) => {
        res.render("course-all", { courses, error, userRole });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static viewCourseDetail(req, res) {
    const courseId = req.params.courseId;
    Course.findByPk(courseId, {
      include: Instructor,
    })
      .then((course) => {
        res.render("course-detail", { course });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static bookCourseForm(req, res) {
    const { userId } = req.session;
    let { courseId } = req.params;
    let coursePrice = 0;
    let courseName = "";
    let courseDate = "";
    User.findByPk(userId)
      .then(() => {
        return Course.findByPk(courseId);
      })
      .then((course) => {
        coursePrice = course.price;
        courseName = course.name;
        courseDate = course.courseDate;
        courseId = +courseId;
        return Transaction.findOne({ where: { CourseId: courseId } });
      })
      .then((result) => {
        if (result) {
          let errors = "Pelajaran telah dipesan sebelumnya";
          return res.redirect(`/course?error=${errors}`);
        } else {
          Transaction.create({
            UserId: userId,
            CourseId: courseId,
            transactionCourse: courseName,
            transactionCourseDate: courseDate,
            transactionCost: coursePrice,
          });
          return res.redirect(`/transaction/${userId}`);
        }
      })
      .catch((err) => {
        console.log(err);
        return res.send(err);
      });
  }

  static submitCourse(req, res) {
    res.send("submitCourse");
  }

  static viewStudentProfile(req, res) {
    const studentId = req.params.studentId;
    UserProfile.findOne({
      where: { UserId: studentId },
    })
      .then((userProfile) => {
        if (userProfile) {
          res.render("student-profile", { userProfile });
        } else {
          res.render("student-profile-form", { studentId });
        }
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static submitProfile(req, res) {
    const studentId = req.params.studentId;
    const { fullName, imageUrl, address, gender, phone } = req.body;

    UserProfile.create({
      fullName: fullName,
      imageUrl: imageUrl,
      address: address,
      gender: gender,
      phone: phone,
      UserId: studentId,
    })
      .then(() => {
        res.redirect(`/profile/${studentId}`);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static viewPurchasedCourse(req, res) {
    const { userRole, userId } = req.session;
    User.findByPk(userId, {
      include: [Transaction, UserProfile],
    })
      .then((student) => {
        res.render("./student/transactions", { userRole, student });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static deleteCourse(req, res) {
    res.send("deleteCourse");
  }
}
module.exports = Student;
