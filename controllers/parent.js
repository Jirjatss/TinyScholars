const {User} = require ('../models')

class Parent {

  static viewStudentList(req, res) {
    User.findAll({
      where: {
          role: 'student'
      }
    })
    .then(students => {
        res.render('student-list', { students });
    })
    .catch(error => {
        console.error(error);
        res.send('Error fetching student list');
    });
  }
  static viewStudentDetail(req, res) {
    res.send("viewStudentDetail");
  }
}
module.exports = Parent;
