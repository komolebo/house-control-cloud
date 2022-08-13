"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "preferences", "dark_mode"
    );

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "preferences", "dark_mode", Sequelize.STRING
    );
  }
};
