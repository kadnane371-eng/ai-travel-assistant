import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Place = sequelize.define(
  "Place",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING, 
      allowNull: false,
    },

    category: {
      type: DataTypes.STRING, 
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    budgetLevel: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },

    estimatedPriceDh: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },

    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "places",
    timestamps: true,
  }
);

export default Place;