"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "auth", "reset_token"
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "auth", "reset_token", Sequelize.TEXT
    );
  }
};
