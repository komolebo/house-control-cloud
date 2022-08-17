"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "auth", "token", Sequelize.STRING
    );
    await queryInterface.renameColumn(
        "auth", "reset_token_expire", "token_expire"
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "auth", "token"
    );
    await queryInterface.renameColumn(
        "auth", "token_expire", "reset_token_expire"
    );
  }
};
