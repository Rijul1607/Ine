// src/models/Bid.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Bid = sequelize.define('Bid', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  auction_id: { type: DataTypes.UUID, allowNull: false },
  user_id: { type: DataTypes.UUID, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'bids',
  timestamps: false
});

export default Bid;
