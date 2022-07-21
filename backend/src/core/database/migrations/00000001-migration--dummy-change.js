"use strict";
const { Op } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: { type: Sequelize.STRING },
      login: { type: Sequelize.STRING, allowNull: false, unique: true },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("roles", {
      role: {
        type: Sequelize.ENUM("Owner", "Guest", "Child", "None", "Default"),
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: "roles_deviceId_userId_unique",
      },
      deviceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: "roles_deviceId_userId_unique",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("devices", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: Sequelize.STRING, allowNull: false },
      ip: { type: Sequelize.STRING, allowNull: false },
      hex: { type: Sequelize.STRING, allowNull: false },
      last_connected: { type: Sequelize.DATE },
      active: { type: Sequelize.BOOLEAN },
      version: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("notifications", {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      deviceId: { type: Sequelize.INTEGER, allowNull: false },
      sourceUserId: { type: Sequelize.INTEGER, allowNull: true },
      msgType: {
        type: Sequelize.ENUM(
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "YOU_ARE_ADDED",
          "DEVICE_ADDED",
          "USER_REMOVED",
          "YOU_LOST_ACCESS",
          "ACCEPT_USER_ADD",
          "ACCEPT_USER_REMOVE",
          "YOU_ARE_INVITED",
          "SUBSCRIPTION_EXPIRED",
          "SUBSCRIPTION_PROLONGED"
        ),
        allowNull: false,
      },
      severity: {
        type: Sequelize.ENUM("0", "1", "2", "INFO", "ACTION", "ERROR"),
        allowNull: false,
      },
      text: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("history", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: Sequelize.ENUM(
          "0",
          "1",
          "2",
          "3",
          "4",
          "Devices",
          "Account",
          "Notification",
          "None",
          "TYPE_NUMBER"
        ),
        allowNull: false,
      },
      text: { type: Sequelize.STRING, allowNull: false },
      uId: { type: Sequelize.STRING },
      devId: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: true },
    });
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
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
      fields: ["sourceUserId"],
      type: "foreign key",
      name: "fk_notifications_sourceUserId_users",
    });
    await queryInterface.addConstraint("history", {
      references: { table: "users", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
      fields: ["userId"],
      type: "foreign key",
      name: "fk_history_userId_users",
    });
    await queryInterface.addConstraint("roles", {
      type: "unique",
      name: "roles_deviceId_userId_unique",
      fields: ["userId", "deviceId"],
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint(
      "roles",
      "roles_deviceId_userId_unique"
    );
    await queryInterface.removeConstraint("roles", "fk_roles_userId_users");
    await queryInterface.removeConstraint("roles", "fk_roles_deviceId_devices");
    await queryInterface.removeConstraint(
      "notifications",
      "fk_notifications_sourceUserId_users"
    );
    await queryInterface.removeConstraint("history", "fk_history_userId_users");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("roles");
    await queryInterface.dropTable("devices");
    await queryInterface.dropTable("notifications");
    await queryInterface.dropTable("history");
  },
};
