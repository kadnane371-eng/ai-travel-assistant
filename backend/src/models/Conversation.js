import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Nouvelle discussion de voyage",
    },
  },
  {
    tableName: "conversations",
    timestamps: true,
  }
);

export default Conversation;
