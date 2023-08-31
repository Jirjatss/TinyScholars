const {User, UserProfile, Course, Transaction} = require ('../models')
const csv = require('csv-express')
const formatDate = require("../helpers/format-date");
const formatCurrency = require("../helpers/format-currency");

class Parent {

  static viewStudentList(req, res) {
    User.findAll({
      where: {
        role: 'Student'
      },
      include: UserProfile
    })
    .then(students => {
      res.render('student-list', { students })
      console.log(students)
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    })
  }
  

  static viewStudentDetail(req, res) {
    const studentId = req.params.studentId
  
    User.findByPk(studentId, {
      include: [UserProfile, {
        model: Transaction,
        as: 'Transactions',
        include: [Course]
      }]
    })
      .then(student => {
        console.log(student);
        res.render('student-detail', { student, formatDate, formatCurrency })
      })
      .catch(error => {
        console.log(error)
        res.send(error)
      })
  }



  static downloadStudentCSV(req, res) {
    const studentId = req.params.studentId
  
    User.findByPk(studentId, {
      include: [
        {
          model: UserProfile,
          as: 'UserProfile'
        },
        {
          model: Transaction,
          include: [Course]
        }
      ]
    })
      .then(student => {
        let csvData = 'FullName,ImageUrl,Address,Gender,Phone,CourseName,CourseDate,CourseSchedule,TransactionCost,TransactionStatus\n';
  
        student.Transactions.forEach(transaction => {
          csvData += `${student.UserProfile.fullName},${student.UserProfile.imageUrl},${student.UserProfile.address},${student.UserProfile.gender},${student.UserProfile.phone},`
          csvData += `${transaction.Course.name},${formatDate(transaction.transactionCourseDate)},${transaction.Course.schedule},${formatCurrency(transaction.transactionCost)},${transaction.transactionStatus}\n`
        })
  
        res.setHeader('Content-disposition', 'attachment; filename=student_profile.csv')
        res.send(csvData)
      })
      .catch(error => {
        console.log(error)
        res.send(error)
      })
  }
  
  
  
  

  
}
module.exports = Parent;
