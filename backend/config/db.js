// src/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.SUPABASE_DB_URL) {
  throw new Error('SUPABASE_DB_URL missing in .env');
}

const sequelize = new Sequelize(process.env.SUPABASE_DB_URL, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;
