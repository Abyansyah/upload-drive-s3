const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Image = sequelize.define(
  'Image',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    google_drive_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'images',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Image;
