const {Course, Instructor, User, UserProfile} = require ('../models')
const { Op } = require("sequelize");
const formatDate = require('../helpers/format-date')
const formatCurrency = require('../helpers/format-currency')

class Student {

    static viewCourse(req, res) {
        const { search, schedule, sort } = req.query
    
        let whereOptions = {}
        if (search) {
            whereOptions.name = {
                [Op.iLike]: `%${search}%`
            };
        }
    
        if (schedule) {
            whereOptions.schedule = schedule
        }
    
        let orderOption = [['price', 'ASC']]
        if (sort === 'desc') {
            orderOption = [['price', 'DESC']]
        }
        console.log("Schedule:", schedule)
        Course.findAll({
            where: whereOptions,
            order: orderOption,
            include: Instructor
        })
        .then(courses => {
            res.render('course-all', {courses, formatCurrency, formatDate})
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    }
    

    static viewCourseDetail(req, res) {
        const courseId = req.params.courseId
        Course.findByPk(courseId, {
            include: Instructor
        })
        .then(course => {
            res.render('course-detail', {course, formatDate})
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    }


    static bookCourseForm(req, res) {
        res.send("bookCourseForm");
    }

    static submitCourse(req, res) {
        res.send("submitCourse");
    }

    static viewStudentProfile(req, res) {
        const studentId = req.params.studentId
        UserProfile.findOne({
          where: { UserId: studentId }
        })
          .then(userProfile => {
            if (userProfile) {
              res.render('student-profile', { userProfile })
            } else {
              res.render('student-profile-form', { studentId })
            }
          })
          .catch(err => {
            console.log(err)
            res.send(err)
          })
      }


    static submitProfile(req, res) {
        const studentId = req.params.studentId
        const { fullName, imageUrl, address, gender, phone } = req.body
    
        UserProfile.create({
            fullName: fullName,
            imageUrl: imageUrl,
            address: address,
            gender: gender,
            phone: phone,
            UserId: studentId
        })
        .then(() => {
            res.redirect(`/profile/${studentId}`)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    }
    

    static viewPurchasedCourse(req, res) {
        res.send("viewPurchasedCourse");
    }

    static deleteCourse(req, res) {
        res.send("deleteCourse");
    }

}
module.exports = Student;
