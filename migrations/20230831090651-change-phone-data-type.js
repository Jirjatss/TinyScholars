'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('UserProfiles', 'phone', {
      type: Sequelize.STRING
    })
  },

  down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('UserProfiles', 'phone', {
      type: Sequelize.INTEGER
    });
  }
};
