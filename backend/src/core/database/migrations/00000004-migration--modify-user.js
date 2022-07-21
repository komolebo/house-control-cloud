"use strict";
const { Op } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "users", "login", Sequelize.STRING
    );
    await queryInterface.renameColumn(
        "users", "name", "full_name"
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "users","login"
    );
    await queryInterface.renameColumn(
        "users", "full_name", "name"
    );
  },
};
