class Controller {
  static home(req, res) {
    res.render("home");
  }
  static login(req, res) {}

  static register(req, res) {
    res.render("register");
  }
}
module.exports = Controller;
