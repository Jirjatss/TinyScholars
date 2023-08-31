const express = require("express");
const Controller = require("./controllers");
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.get("/", Controller.home);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
