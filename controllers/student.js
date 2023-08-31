const {Course, Instructor, User, UserProfile} = require ('../models')
const { Op } = require("sequelize");

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
            res.render('course-all', {courses})
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
        res.render('course-detail', {course})
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
    res.send("viewStudentProfile");
  }
  static profileForm(req, res) {
    res.send("profileForm");
  }
  static submitProfile(req, res) {
    res.send("submitProfile");
  }
  static viewPurchasedCourse(req, res) {
    res.send("viewPurchasedCourse");
  }
  static deleteCourse(req, res) {
    res.send("deleteCourse");
  }

}
module.exports = Student;
