'use strict';

const { DataTypes } = require('sequelize');
const { User } = require('../models');

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      const opts = {
        transaction: t,
      };

      // user table
      await queryInterface.createTable(
        User.tableName,
        {
          id: {
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: DataTypes.BIGINT,
          },
          user_id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
          },
          name: {
            allowNull: false,
            type: DataTypes.STRING(30),
          },
          email: {
            allowNull: false,
            type: DataTypes.STRING(50),
          },
          password: {
            allowNull: true,
            type: DataTypes.STRING(255),
          },
          status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          created_at: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          updated_at: {
            allowNull: true,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
          },
          deleted_at: {
            allowNull: true,
            type: DataTypes.DATE,
          },
        },
        opts
      );
      await queryInterface.addIndex(User.tableName, ['id', 'user_id'], opts);
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      const opts = {
        transaction: t,
      };
      await queryInterface.dropTable(User.tableName, opts);
    });
  },
};
