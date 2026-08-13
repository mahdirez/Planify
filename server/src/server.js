import dotenv from "dotenv";

dotenv.config();

await import("./config/env.js");

const { default: app } = await import("./app.js");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
