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
      alias: { type: Sequelize.STRING },
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
      objUserId: { type: Sequelize.INTEGER },
      msgType: {
        type: Sequelize.ENUM(
          "YOU_GOT_ACCESS",
          "USER_GOT_ACCESS",
          "YOU_LOST_ACCESS",
          "USER_LOST_ACCESS",
          "YOU_ARE_MODIFIED",
          "USER_IS_MODIFIED",
          "ALL_USERS_CLEAR",
          "ACCEPT_USER_ADD",
          "ACCEPT_USER_REMOVE",
          "ACCEPT_OWNER_RIGHTS",
          "SUBSCRIPTION_EXPIRED",
          "SUBSCRIPTION_PROLONGED"
        ),
        allowNull: false,
      },
      severity: {
        type: Sequelize.ENUM("INFO", "ACTION", "ERROR"),
        allowNull: false,
      },
      text: { type: Sequelize.STRING },
      userNotificationFkId: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      routineId: { type: Sequelize.INTEGER, allowNull: true },
    });
    await queryInterface.createTable("history", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: Sequelize.ENUM("Devices", "Account", "Notification", "None"),
        allowNull: false,
      },
      text: { type: Sequelize.STRING, allowNull: false },
      uId: { type: Sequelize.STRING },
      devId: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      userId: { type: Sequelize.INTEGER, allowNull: true },
    });
    await queryInterface.createTable("preferences", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      phone_verified: { type: Sequelize.BOOLEAN },
      email_verified: { type: Sequelize.BOOLEAN },
      profile_photo: { type: Sequelize.STRING },
      profile_photo_id: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      uId: { type: Sequelize.INTEGER, allowNull: true },
    });
    await queryInterface.createTable("blacklist", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      prefId: { type: Sequelize.INTEGER, allowNull: false },
      blockUserId: { type: Sequelize.INTEGER, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("auth", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      token: { type: Sequelize.TEXT },
      token_expire: { type: Sequelize.DATE },
      activated: { type: Sequelize.BOOLEAN },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
      userAuthId: { type: Sequelize.INTEGER, allowNull: true },
    });
    await queryInterface.createTable("routines", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: Sequelize.ENUM(
          "ACCEPT_MEMBER_BECOME_OWNER",
          "ACCEPT_USER_GRANT_ACCESS"
        ),
        allowNull: false,
      },
      objUserId: { type: Sequelize.INTEGER },
      objDeviceId: { type: Sequelize.INTEGER },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.createTable("releases", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      sys_version: { type: Sequelize.STRING, allowNull: false },
      bridge: { type: Sequelize.BOOLEAN },
      socApp: { type: Sequelize.STRING },
      soc: { type: Sequelize.STRING },
      hub: { type: Sequelize.STRING },
      pir: { type: Sequelize.STRING },
      smoke: { type: Sequelize.STRING },
      gas: { type: Sequelize.STRING },
      climate: { type: Sequelize.STRING },
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
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      fields: ["userNotificationFkId"],
      type: "foreign key",
      name: "fk_notifications_userNotificationFkId_users",
    });
    await queryInterface.addConstraint("notifications", {
      references: { table: "routines", field: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
      fields: ["routineId"],
      type: "foreign key",
      name: "fk_notifications_routineId_routines",
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
    await queryInterface.addConstraint("auth", {
      references: { table: "users", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      fields: ["userAuthId"],
      type: "foreign key",
      name: "fk_auth_userAuthId_users",
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
      "fk_notifications_userNotificationFkId_users"
    );
    await queryInterface.removeConstraint(
      "notifications",
      "fk_notifications_routineId_routines"
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
    await queryInterface.removeConstraint("auth", "fk_auth_userAuthId_users");
    await queryInterface.dropTable("users");
    await queryInterface.dropTable("roles");
    await queryInterface.dropTable("devices");
    await queryInterface.dropTable("notifications");
    await queryInterface.dropTable("history");
    await queryInterface.dropTable("preferences");
    await queryInterface.dropTable("blacklist");
    await queryInterface.dropTable("auth");
    await queryInterface.dropTable("routines");
    await queryInterface.dropTable("releases");
  },
};
