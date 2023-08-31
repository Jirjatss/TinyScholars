const {User, UserProfile, Course} = require ('../models')
const csv = require('csv-express')

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
      include: UserProfile
      //nanti tambahin include Course di sini
    })
      .then(student => {
        res.render('student-detail', { student })
      })
      .catch(error => {
        console.log(error)
        res.send(error)
      })
  }

  static downloadStudentCSV(req, res) {
    const studentId = req.params.studentId

    User.findOne({
      where: {
        id: studentId,
        role: 'Student'
      },
      include: [
        {
          model: UserProfile,
          as: 'UserProfile'
        }
      ]
    })
      .then(student => {
        if (!student || !student.UserProfile) {
          return res.send('Student not found')
        }

        const csvData = [
          {
            FullName: student.UserProfile.fullName,
            ImageUrl: student.UserProfile.imageUrl,
            Address: student.UserProfile.address,
            Gender: student.UserProfile.gender,
            Phone: student.UserProfile.phone
          }
        ]

        res.setHeader('Content-disposition', 'attachment; filename=student_profile.csv');
        res.csv(csvData, true)
      })
      .catch(error => {
        console.log(error)
        res.send(error)
      })
  }
  
  
}
module.exports = Parent;
