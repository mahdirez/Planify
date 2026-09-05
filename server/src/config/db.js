import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const isLocalDatabase =
  !connectionString ||
  /localhost|127\.0\.0\.1/.test(connectionString);

const pool = new Pool({
  connectionString,
  ...(isLocalDatabase
    ? {}
    : {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
});

pool.on("error", (err) => {
  console.error("Unexpected PG pool error:", err);
});

export default pool;
