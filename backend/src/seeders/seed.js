import bcrypt from "bcrypt";
import { sequelize, User, Place, Trip, TripDay, TripItem } from "../models/index.js";

const initialPlaces = [
  {
    name: "Jardin Majorelle",
    city: "Marrakech",
    category: "Jardin",
    description: "Jardin botanique emblématique créé par Jacques Majorelle et restauré par Yves Saint Laurent.",
    budgetLevel: "medium",
    estimatedPriceDh: 150.0,
    latitude: 31.6416,
    longitude: -8.0033,
  },
  {
    name: "Place Jemaa el-Fna",
    city: "Marrakech",
    category: "Place / Souk",
    description: "Cœur battant de la médina de Marrakech, célèbre pour ses conteurs, musiciens et stands de cuisine.",
    budgetLevel: "low",
    estimatedPriceDh: 50.0,
    latitude: 31.6258,
    longitude: -7.9891,
  },
  {
    name: "Palais Bahia",
    city: "Marrakech",
    category: "Monument",
    description: "Chef-d'œuvre de l'architecture marocaine du XIXe siècle avec ses cours en marbre et jardins d'orangers.",
    budgetLevel: "low",
    estimatedPriceDh: 70.0,
    latitude: 31.6218,
    longitude: -7.9818,
  },
  {
    name: "Tanneries Chouara",
    city: "Fès",
    category: "Artisanat",
    description: "Les plus anciennes et célèbres tanneries traditionnelles de cuir au monde dans la médina de Fès.",
    budgetLevel: "low",
    estimatedPriceDh: 20.0,
    latitude: 34.0664,
    longitude: -4.9723,
  },
  {
    name: "Université Al Quaraouiyine",
    city: "Fès",
    category: "Monument",
    description: "La plus ancienne université en activité continue au monde, fondée par Fatima al-Fihriya en 859.",
    budgetLevel: "low",
    estimatedPriceDh: 0.0,
    latitude: 34.0649,
    longitude: -4.9735,
  },
  {
    name: "Café Hafa",
    city: "Tanger",
    category: "Café",
    description: "Café mythique perché sur une falaise face au détroit de Gibraltar, prisé pour son thé à la menthe.",
    budgetLevel: "low",
    estimatedPriceDh: 25.0,
    latitude: 35.7915,
    longitude: -5.8193,
  },
  {
    name: "Grottes d'Hercule",
    city: "Tanger",
    category: "Nature",
    description: "Site naturel et mythologique avec son ouverture spectaculaire vers l'océan Atlantique.",
    budgetLevel: "low",
    estimatedPriceDh: 60.0,
    latitude: 35.7597,
    longitude: -5.9392,
  },
  {
    name: "Médina Bleue",
    city: "Chefchaouen",
    category: "Médina",
    description: "Ruelle pavées aux nuances de bleu apaisantes, artisanat local et ambiance montagnarde unique.",
    budgetLevel: "low",
    estimatedPriceDh: 0.0,
    latitude: 35.1688,
    longitude: -5.2636,
  },
  {
    name: "Cascades d'Akchour",
    city: "Chefchaouen",
    category: "Nature & Trekking",
    description: "Parcours de randonnée magnifique longeant des rivières d'eau cristalline jusqu'au Pont de Dieu et de hautes cascades au cœur de Talassemtane.",
    budgetLevel: "low",
    estimatedPriceDh: 40.0,
    latitude: 35.2415,
    longitude: -5.1772,
  },
  {
    name: "Remparts de la Sqala du Port",
    city: "Essaouira",
    category: "Monument & Mer",
    description: "Ancienne fortification maritime avec ses canons en bronze pointés vers l'Atlantique, vue magique sur l'océan.",
    budgetLevel: "low",
    estimatedPriceDh: 50.0,
    latitude: 31.5125,
    longitude: -9.7744,
  },
  {
    name: "Ksar d'Aït Benhaddou",
    city: "Ouarzazate",
    category: "Patrimoine UNESCO",
    description: "Village fortifié traditionnel en pisé sur les contreforts de l'Atlas, célèbre décor de tournage de chefs-d'œuvre cinématographiques.",
    budgetLevel: "medium",
    estimatedPriceDh: 50.0,
    latitude: 31.0475,
    longitude: -7.1317,
  },
  {
    name: "Dunes de l'Erg Chebbi",
    city: "Merzouga",
    category: "Désert & Aventure",
    description: "Immenses dunes dorées du Sahara culminant à 150 mètres. Balade à dos de dromadaire au coucher du soleil et nuit sous tente berbère.",
    budgetLevel: "high",
    estimatedPriceDh: 600.0,
    latitude: 31.1444,
    longitude: -3.9972,
  },
];

const runSeed = async () => {
  try {
    console.log("🌱 Début du remplissage de la base de données...");
    await sequelize.sync({ force: true });

    // 1. Créer un utilisateur de démonstration
    const hashedPassword = await bcrypt.hash("password123", 10);
    const demoUser = await User.create({
      fullName: "Anas El Amrani",
      email: "anas@example.com",
      password: hashedPassword,
    });
    console.log("👤 Utilisateur test créé : anas@example.com / password123");

    // 2. Insérer les lieux du Maroc
    const createdPlaces = await Place.bulkCreate(initialPlaces);
    console.log(`📍 ${createdPlaces.length} lieux marocains insérés avec succès.`);

    // 3. Créer un voyage de démonstration
    const sampleTrip = await Trip.create({
      userId: demoUser.id,
      title: "Week-end Culturel à Marrakech",
      city: "Marrakech",
      budgetTotalDh: 1200,
      daysCount: 2,
      status: "confirmed",
    });

    const day1 = await TripDay.create({
      tripId: sampleTrip.id,
      dayNumber: 1,
      title: "Jour 1 : Les Trésors Historiques",
    });

    await TripItem.bulkCreate([
      {
        tripDayId: day1.id,
        placeId: createdPlaces[0].id,
        timeSlot: "morning",
        title: "Visite du Jardin Majorelle",
        costDh: 150,
      },
      {
        tripDayId: day1.id,
        placeId: createdPlaces[1].id,
        timeSlot: "evening",
        title: "Dîner street-food à Jemaa el-Fna",
        costDh: 80,
      },
    ]);

    // 4. Indexation vectorielle dans Pinecone si configuré
    if (process.env.PINECONE_API_KEY) {
      console.log("🌲 Indexation vectorielle dans Pinecone (modèle llama-text-embed-v2 1024-dim)...");
      const { upsertPlaceEmbedding } = await import("../services/pinecone.service.js");
      for (const place of createdPlaces) {
        await upsertPlaceEmbedding(place);
      }
      console.log("🌲 Lieux indexés avec succès dans Pinecone !");
    }

    console.log("✅ Remplissage terminé avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur pendant le seeding :", err);
    process.exit(1);
  }
};

runSeed();
