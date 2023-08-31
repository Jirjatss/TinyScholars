const { Course, Instructor, User, UserProfile, Transaction } = require("../models");
const { Op } = require("sequelize");
const formatDate = require("../helpers/format-date");
const formatCurrency = require("../helpers/format-currency");

class Student {
  static viewCourse(req, res) {
    const { search, schedule, sort, error } = req.query;
    const { userRole, userImage, userId } = req.session;

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
        res.render("course-all", { courses, error, userRole, formatDate, formatCurrency, userImage, userId });
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
        res.render("course-detail", { course, formatCurrency });
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

  static viewProfile(req, res) {
    const { userId } = req.session;
    UserProfile.findOne({
      where: { UserId: userId },
    })
      .then((profile) => {
        res.render("userProfile", { userProfile: profile });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static profileForm(req, res) {
    const { userId } = req.session;
    UserProfile.findOne({
      where: { UserId: userId },
    })
      .then(() => {
        res.render("userProfileForm", { userId });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static submitProfile(req, res) {
    const { userId } = req.session;
    const { fullName, imageUrl, address, gender, phone } = req.body;

    UserProfile.create({
      fullName: fullName,
      imageUrl: imageUrl,
      address: address,
      gender: gender,
      phone: phone,
      UserId: userId,
    })
      .then(() => {
        res.redirect(`/profile/${userId}`);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static viewPurchasedCourse(req, res) {
    const { userRole, userId, userImage } = req.session;
    User.findByPk(userId, {
      include: [Transaction, UserProfile],
    })
      .then((student) => {
        res.render("./student/transactions", { userRole, student, formatDate, formatCurrency, userImage, userId });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static deleteCourse(req, res) {
    res.send("deleteCourse");
  }
  static attend(req, res) {
    const { transactionId } = req.params;
    const { userId } = req.session;

    Transaction.findByPk(transactionId)
      .then((transaction) => {
        return transaction.update({ transactionStatus: "Attend" });
      })
      .then(() => {
        res.redirect(`/transaction/${userId}`);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static cancel(req, res) {
    const { transactionId } = req.params;
    const { userId } = req.session;

    Transaction.findByPk(transactionId)
      .then((transaction) => {
        return transaction.destroy();
      })
      .then(() => {
        res.redirect(`/transaction/${userId}`);
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
}
module.exports = Student;
