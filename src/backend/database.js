import pg from "pg";
import dotenv from "dotenv"
dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});



db.connect((err) => {
  if (!err) console.error('DB connection successful');
  else console.error('Error connecting to client',err);
});

export default db;