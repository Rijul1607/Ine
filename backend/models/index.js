// src/models/index.js
import User from './User.js';
import Auction from './Auction.js';
import Bid from './Bid.js';
import Notification from './Notification.js';

// Associations
Auction.belongsTo(User, { as: 'seller', foreignKey: 'seller_id' });
Bid.belongsTo(Auction, { foreignKey: 'auction_id' });
Bid.belongsTo(User, { as: 'bidder', foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

export { User, Auction, Bid, Notification };
