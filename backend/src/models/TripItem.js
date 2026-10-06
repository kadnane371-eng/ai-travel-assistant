import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TripItem = sequelize.define(
  "TripItem",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tripDayId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    placeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    timeSlot: {
      type: DataTypes.ENUM("morning", "afternoon", "evening"),
      defaultValue: "morning",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    costDh: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
  },
  {
    tableName: "trip_items",
    timestamps: true,
  }
);

export default TripItem;
