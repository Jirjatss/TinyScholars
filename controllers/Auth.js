const session = require("express-session");
const { User } = require("../models");
let bcrypt = require("bcryptjs");

class AuthController {
  static home(req, res) {
    res.render("home");
  }
  static login(req, res) {
    const { error } = req.query;
    res.render("login", { error });
  }

  static postLogin(req, res) {
    const { email, password } = req.body;
    User.findOne({
      where: {
        email: email,
      },
    })
      .then((user) => {
        if (user) {
          let isValUser = bcrypt.compareSync(password, user.password);
          if (isValUser) {
            req.session.userId = user.id;
            req, (session.userRole = user.role);
            return res.redirect("/");
          } else {
            let errors = "Email/Password not match!";
            return res.redirect(`/login?error=${errors}`);
          }
        } else {
          let errors = "Email/Password not match!";
          return res.redirect(`/login?error=${errors}`);
        }
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  }
  static register(req, res) {
    res.render("register");
  }
  static postRegister(req, res) {
    const { email, password, role } = req.body;
    User.create({ email, password, role })
      .then((_) => {
        res.redirect("/");
      })
      .catch((err) => res.send(err));
  }
}
module.exports = AuthController;
