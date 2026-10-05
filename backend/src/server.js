import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

sequelize
  .authenticate()
  .then(async () => {
    console.log("Database connected successfully");

    await sequelize.sync();
    console.log("Tables synchronized");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });