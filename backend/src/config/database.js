import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || "ai_travel_assistant",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "1234",
    {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5433,
        dialect: "postgres",
        logging: false,
    }
);

export default sequelize;