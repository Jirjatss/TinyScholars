"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn("Instructors", "CourseId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Courses",
      },
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("Instructors", "CourseId");
  },
};
