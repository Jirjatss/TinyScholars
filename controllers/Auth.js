const { User } = require("../models");
let bcrypt = require("bcryptjs");

class AuthController {
  static home(req, res) {
    const { error } = req.query;
    const { userRole } = req.session;
    res.render("home", { error, userRole });
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

            req.session.userRole = user.role;
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
    const { error } = req.query;
    res.render("register", { error });
  }
  static postRegister(req, res) {
    const { email, password, role } = req.body;
    User.create({ email, password, role })
      .then((_) => {
        res.redirect("/");
      })
      .catch((err) => {
        if (err.name === "SequelizeValidationError") {
          let errors = err.errors.map((e) => {
            return e.message;
          });
          res.redirect(`/register?error=${errors}`);
        }
      });
  }
}
module.exports = AuthController;
