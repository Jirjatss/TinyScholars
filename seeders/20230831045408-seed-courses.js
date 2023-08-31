"use strict";
const fs = require("fs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync("./data/courses.json", "utf-8")).map((e) => {
      e.createdAt = e.updatedAt = new Date();
      return e;
    });

    return queryInterface.bulkInsert("Courses", data);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Courses");
  },
};
