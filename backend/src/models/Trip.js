import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Trip = sequelize.define(
  "Trip",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budgetTotalDh: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    daysCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "trips",
    timestamps: true,
  }
);

export default Trip;