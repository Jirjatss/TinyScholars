"use strict";
const fs = require("fs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    let data = JSON.parse(fs.readFileSync("./data/instructors.json", "utf-8")).map((e) => {
      e.createdAt = e.updatedAt = new Date();
      return e;
    });

    return queryInterface.bulkInsert("Instructors", data);
  },

  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Instructors");
  },
};
