import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TripDay = sequelize.define(
  "TripDay",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tripId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dayNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Journée de visite",
    },
  },
  {
    tableName: "trip_days",
    timestamps: true,
  }
);

export default TripDay;
