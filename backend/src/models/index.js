import sequelize from "../config/database.js";
import User from "./User.js";
import Place from "./Place.js";
import Trip from "./Trip.js";
import TripDay from "./TripDay.js";
import TripItem from "./TripItem.js";
import Conversation from "./Conversation.js";
import Message from "./Message.js";

// ==========================================
// RELATIONS ENTRE LES MODÈLES (3NF)
// ==========================================

// 1. Un utilisateur a plusieurs voyages
User.hasMany(Trip, { foreignKey: "userId", as: "trips", onDelete: "CASCADE" });
Trip.belongsTo(User, { foreignKey: "userId", as: "user" });

// 2. Un voyage a plusieurs journées (TripDay)
Trip.hasMany(TripDay, { foreignKey: "tripId", as: "days", onDelete: "CASCADE" });
TripDay.belongsTo(Trip, { foreignKey: "tripId", as: "trip" });

// 3. Une journée a plusieurs activités (TripItem)
TripDay.hasMany(TripItem, { foreignKey: "tripDayId", as: "items", onDelete: "CASCADE" });
TripItem.belongsTo(TripDay, { foreignKey: "tripDayId", as: "day" });

// 4. Une activité peut être liée à un lieu enregistré (Place)
TripItem.belongsTo(Place, { foreignKey: "placeId", as: "place" });
Place.hasMany(TripItem, { foreignKey: "placeId", as: "tripItems" });

// 5. Un utilisateur a plusieurs conversations avec l'IA
User.hasMany(Conversation, { foreignKey: "userId", as: "conversations", onDelete: "CASCADE" });
Conversation.belongsTo(User, { foreignKey: "userId", as: "user" });

// 6. Une conversation a plusieurs messages
Conversation.hasMany(Message, { foreignKey: "conversationId", as: "messages", onDelete: "CASCADE" });
Message.belongsTo(Conversation, { foreignKey: "conversationId", as: "conversation" });

export {
  sequelize,
  User,
  Place,
  Trip,
  TripDay,
  TripItem,
  Conversation,
  Message,
};