"use strict";
const { Op } = require("sequelize");
// text: { type: Sequelize.STRING },

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "notifications", "text", Sequelize.STRING
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "notifications",
        "text"
    );
  },
};
