const requiredEnvVars = [
  "PORT",
  "DB_USER",
  "DB_HOST",
  "DB_NAME",
  "DB_PORT",
  "JWT_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
