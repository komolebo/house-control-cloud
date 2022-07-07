"use strict";
const { Op } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("notifications", {
      references: { table: "users", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
      fields: ["sourceUserId"],
      type: "foreign key",
      name: "fk_notifications_sourceUserId_users",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "notifications",
      "fk_notifications_sourceUserId_users"
    );
  },
};
