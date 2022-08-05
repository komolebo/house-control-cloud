"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "roles", "alias", Sequelize.STRING
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "roles", "alias"
    );
  }
};
