class Controller {
  static home(req, res) {
    res.render("home");
  }
  static login(req, res) {
    res.send("login");
  }
  static register(req, res) {
    res.send("register");
  }
}
module.exports = Controller;
