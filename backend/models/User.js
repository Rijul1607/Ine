// src/models/User.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, primaryKey: true },
  name: { type: DataTypes.TEXT, allowNull: false },
  role: { type: DataTypes.ENUM('buyer','seller','admin'), allowNull: false, defaultValue: 'buyer' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',
  timestamps: false
});

export default User;
