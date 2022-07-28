"use strict";
const { Op } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("roles", {
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      fields: ["userId"],
      type: "foreign key",
      name: "fk_roles_userId_users",
    });
    await queryInterface.addConstraint("roles", {
      references: { table: "devices", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      fields: ["deviceId"],
      type: "foreign key",
      name: "fk_roles_deviceId_devices",
    });
    await queryInterface.addConstraint("notifications", {
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      fields: ["sourceUserId"],
      type: "foreign key",
      name: "fk_notifications_sourceUserId_users",
    });
    await queryInterface.addConstraint("history", {
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      fields: ["userId"],
      type: "foreign key",
      name: "fk_history_userId_users",
    });
    await queryInterface.addConstraint("preferences", {
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      fields: ["uId"],
      type: "foreign key",
      name: "fk_preferences_uId_users",
    });
    await queryInterface.addConstraint("blacklist", {
      references: { table: "preferences", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      fields: ["prefId"],
      type: "foreign key",
      name: "fk_blacklist_prefId_preferences",
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("roles", "fk_roles_userId_users");
    await queryInterface.removeConstraint("roles", "fk_roles_deviceId_devices");

    await queryInterface.removeConstraint(
        "notifications",
        "fk_notifications_sourceUserId_users"
    );
    await queryInterface.removeConstraint("history", "fk_history_userId_users");
    await queryInterface.removeConstraint(
        "preferences",
        "fk_preferences_uId_users"
    );
    await queryInterface.removeConstraint(
        "blacklist",
        "fk_blacklist_prefId_preferences"
    );
  },
};
