import mysql from 'mysql2';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionOptions = {
  host: process.env.DB_HOST, // address of the server
  port: parseInt(<string>process.env.DB_PORT, 10), // port of the DB server (mysql), not to be confused with the nodeJS server PORT !
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(connectionOptions);

export default connection;
