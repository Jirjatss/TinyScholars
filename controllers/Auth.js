const { User, UserProfile } = require("../models");
let bcrypt = require("bcryptjs");

class AuthController {
  static home(req, res) {
    const { error } = req.query;
    const { userRole, userId, userImage } = req.session;
    res.render("home", { error, userRole, userId, userImage });
  }
  static login(req, res) {
    const { error } = req.query;
    res.render("login", { error });
  }

  static postLogin(req, res) {
    const { email, password } = req.body;
    let errors = [];
    if (!email) {
      errors.push("Email required");
    }
    if (!password) {
      errors.push("Password required");
    }
    if (errors.length > 0) {
      return res.redirect(`/login?error=${errors}`);
    } else {
      User.findOne({
        where: {
          email: email,
        },
        include: UserProfile,
      })
        .then((user) => {
          if (user) {
            let isValUser = bcrypt.compareSync(password, user.password);
            if (isValUser) {
              req.session.userId = user.id;
              req.session.userRole = user.role;
              if (user.UserProfile) {
                req.session.userImage = user.UserProfile.imageUrl;
                return res.redirect("/");
              } else {
                return res.redirect(`/profile/${user.id}/add`);
              }
            }
            let errors = "Email/Password not match!";
            return res.redirect(`/login?error=${errors}`);
          }
          let errors = "Email/Password not match!";
          return res.redirect(`/login?error=${errors}`);
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    }
  }
  static register(req, res) {
    const { error } = req.query;
    res.render("register", { error });
  }
  static postRegister(req, res) {
    const { email, password, role } = req.body;
    User.create({ email, password, role })
      .then((_) => {
        res.redirect("/login");
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
  static logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/login");
      }
    });
  }
}
module.exports = AuthController;
