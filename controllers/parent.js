const {Course, Instructor, User, UserProfile} = require ('../models')

class Parent {

  static viewStudentList(req, res) {
    res.send("viewStudentList");
  }
  static viewStudentDetail(req, res) {
    res.send("viewStudentDetail");
  }
}
module.exports = Parent;
