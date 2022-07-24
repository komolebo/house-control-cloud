"use strict";
const { Op } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
        "preferences", "profile_photo", Sequelize.STRING
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
        "preferences", "profile_photo"
    );
  },
};
