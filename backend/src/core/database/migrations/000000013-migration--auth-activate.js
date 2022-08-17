"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "auth", "activated", Sequelize.BOOLEAN
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "auth", "activated"
    );
  }
};
