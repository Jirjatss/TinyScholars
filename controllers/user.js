const { Course, Instructor, User, UserProfile, Transaction } = require("../models");
const { Op } = require("sequelize");
const formatDate = require("../helpers/format-date");
const formatCurrency = require("../helpers/format-currency");

class UserController {
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
        res.render("./user/course-all", { courses, error, userRole, formatDate, formatCurrency, userImage, userId });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static viewCourseDetail(req, res) {
    const courseId = req.params.courseId;
    const { userRole, userId, userImage } = req.session;
    Course.findByPk(courseId, {
      include: {
        model: Instructor,
        where: {
          CourseId: courseId,
        },
      },
    })
      .then((course) => {
        console.log(course);
        res.render("./user/course-detail", { course, formatCurrency, formatDate, userRole, userId, userImage });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static bookCourse(req, res) {
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
        return Transaction.create({
          UserId: userId,
          CourseId: courseId,
          transactionCourse: courseName,
          transactionCourseDate: courseDate,
          transactionCost: coursePrice,
        });
      })
      .then(() => {
        return res.redirect(`/transaction/${userId}`);
      })
      .catch((err) => {
        console.log(err);
        return res.send(err);
      });
  }

  static viewProfile(req, res) {
    const { userId, userRole, userImage } = req.session;
    UserProfile.findOne({
      where: { UserId: userId },
    })
      .then((profile) => {
        res.render("./user/userProfile", { userProfile: profile, userId, userImage, userRole });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static profileForm(req, res) {
    const { error } = req.query;
    const { userId } = req.session;
    UserProfile.findOne({
      where: { UserId: userId },
    })
      .then(() => {
        res.render("./user/userProfileForm", { userId, error });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }

  static submitProfile(req, res) {
    const { userId } = req.session;
    const { fullName, imageUrl, address, gender, phone } = req.body;

    let errors = [];

    if (!fullName) {
      errors.push("Full Name required");
    }
    if (!imageUrl) {
      errors.push("Image Url required");
    }
    if (!address) {
      errors.push("Address required");
    }
    if (!gender) {
      errors.push("Gender required");
    }
    if (!phone) {
      errors.push("Phone required");
    }

    if (errors.length > 0) {
      res.redirect(`/profile/${userId}/add?error=${errors}`);
    } else {
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
  }

  static viewPurchasedCourse(req, res) {
    const { userRole, userId, userImage } = req.session;
    User.findByPk(userId, {
      include: [Transaction, UserProfile],
    })
      .then((student) => {
        res.render("./user/transactions", { userRole, student, formatDate, formatCurrency, userImage, userId });
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
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

  static viewStudentList(req, res) {
    const { userRole, userId, userImage } = req.session;
    User.findAll({
      where: {
        role: "Student",
      },
      include: UserProfile,
    })
      .then((students) => {
        res.render("./user/student-list", { students, userRole, userId, userImage });
        console.log(students);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }

  static viewStudentDetail(req, res) {
    const studentId = req.params.studentId;
    const { userRole, userId, userImage } = req.session;
    User.findByPk(studentId, {
      include: [
        UserProfile,
        {
          model: Transaction,
          as: "Transactions",
          include: [Course],
        },
      ],
    })
      .then((student) => {
        res.render("./user/student-detail", { student, formatDate, formatCurrency, userRole, userId, userImage });
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }

  static downloadStudentCSV(req, res) {
    const studentId = req.params.studentId;

    User.findByPk(studentId, {
      include: [
        {
          model: UserProfile,
          as: "UserProfile",
        },
        {
          model: Transaction,
          include: [Course],
        },
      ],
    })
      .then((student) => {
        let csvData = "FullName,ImageUrl,Address,Gender,Phone,CourseName,CourseDate,CourseSchedule,TransactionCost,TransactionStatus\n";

        student.Transactions.forEach((transaction) => {
          csvData += `${student.UserProfile.fullName},${student.UserProfile.imageUrl},${student.UserProfile.address},${student.UserProfile.gender},${student.UserProfile.phone},`;
          csvData += `${transaction.Course.name},${formatDate(transaction.transactionCourseDate)},${transaction.Course.schedule},${transaction.transactionCost},${transaction.transactionStatus}\n`;
        });

        res.setHeader("Content-disposition", "attachment; filename=student_profile.csv");
        res.send(csvData);
      })
      .catch((error) => {
        console.log(error);
        res.send(error);
      });
  }
}
module.exports = UserController;
