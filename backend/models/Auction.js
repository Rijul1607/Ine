// src/models/Auction.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Auction = sequelize.define('Auction', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  seller_id: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.TEXT, allowNull: false },
  description: { type: DataTypes.TEXT },
  start_price: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  bid_increment: { type: DataTypes.DECIMAL(10,2), allowNull: false, defaultValue: 1.00 },
  start_time: { type: DataTypes.DATE, allowNull: false },
  end_time: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('upcoming','active','ended','closed'), allowNull: false, defaultValue: 'upcoming' },
  highest_bid_id: { type: DataTypes.UUID, allowNull: true },
  highest_bid_amount: { type: DataTypes.DECIMAL(10,2), allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'auctions',
  timestamps: false
});

export default Auction;
