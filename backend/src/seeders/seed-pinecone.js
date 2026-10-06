import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX || "travel-places";
const EMBEDDING_MODEL = process.env.PINECONE_EMBEDDING_MODEL || "llama-text-embed-v2";

if (!PINECONE_API_KEY) {
  console.error("❌ PINECONE_API_KEY manquante dans le fichier .env");
  process.exit(1);
}

const pc = new Pinecone({ apiKey: PINECONE_API_KEY });
const index = pc.index(PINECONE_INDEX_NAME);

// Liste enrichie des lieux incontournables du Maroc 🇲🇦
const moroccoPlaces = [
  {
    id: 1,
    name: "Jardin Majorelle",
    city: "Marrakech",
    category: "Jardin / Culture",
    description: "Jardin botanique emblématique créé par Jacques Majorelle et restauré par Yves Saint Laurent, célèbre pour sa villa bleu cobalt et ses plantes exotiques rares.",
    budgetLevel: "medium",
    estimatedPriceDh: 150,
  },
  {
    id: 2,
    name: "Place Jemaa el-Fna",
    city: "Marrakech",
    category: "Place / Souk",
    description: "Cœur vivant et historique de la médina de Marrakech, classée au patrimoine mondial de l'UNESCO. Célèbre pour ses conteurs, charmeurs de serpents et stands de street food le soir.",
    budgetLevel: "low",
    estimatedPriceDh: 50,
  },
  {
    id: 3,
    name: "Palais Bahia",
    city: "Marrakech",
    category: "Monument Historique",
    description: "Chef-d'œuvre de l'architecture mauresque marocaine du XIXe siècle comprenant 160 pièces, des plafonds sculptés en cèdre et de superbes cours en marbre arborées d'orangers.",
    budgetLevel: "low",
    estimatedPriceDh: 70,
  },
  {
    id: 4,
    name: "Tanneries Chouara",
    city: "Fès",
    category: "Artisanat Traditionnel",
    description: "Les plus anciennes et impressionnantes tanneries de cuir à ciel ouvert au monde dans la médina de Fès el-Bali, perpétuant des techniques artisanales médiévales inchangées.",
    budgetLevel: "low",
    estimatedPriceDh: 20,
  },
  {
    id: 5,
    name: "Université Al Quaraouiyine",
    city: "Fès",
    category: "Monument / Savoir",
    description: "Fondée en 859 par Fatima al-Fihriya, elle est reconnue par l'UNESCO comme la plus ancienne université en activité continue au monde et un joyau de l'art hispano-mauresque.",
    budgetLevel: "low",
    estimatedPriceDh: 0,
  },
  {
    id: 6,
    name: "Café Hafa",
    city: "Tanger",
    category: "Café Mythique",
    description: "Café historique ouvert en 1921, perché sur les falaises de Tanger face au détroit de Gibraltar. Incontournable pour déguster un thé à la menthe avec vue panoramique sur l'Espagne.",
    budgetLevel: "low",
    estimatedPriceDh: 25,
  },
  {
    id: 7,
    name: "Grottes d'Hercule & Cap Spartel",
    city: "Tanger",
    category: "Nature & Mythe",
    description: "Site naturel et mythologique avec son ouverture maritime époustouflante découpée en forme de carte d'Afrique inversée, là où l'océan Atlantique rencontre la mer Méditerranée.",
    budgetLevel: "low",
    estimatedPriceDh: 60,
  },
  {
    id: 8,
    name: "Médina Bleue",
    city: "Chefchaouen",
    category: "Médina / Randonnée",
    description: "Ruelles piétonnes peintes en nuances infinies de bleu ciel et de chaux, nichées dans les montagnes du Rif. Idéale pour la photographie, l'artisanat de laine et la tranquillité.",
    budgetLevel: "low",
    estimatedPriceDh: 0,
  },
  {
    id: 9,
    name: "Cascades d'Akchour",
    city: "Chefchaouen",
    category: "Nature & Trekking",
    description: "Parcours de randonnée magnifique longeant des rivières d'eau cristalline jusqu'au Pont de Dieu et de hautes cascades rafraîchissantes au cœur du parc national de Talassemtane.",
    budgetLevel: "low",
    estimatedPriceDh: 40,
  },
  {
    id: 10,
    name: "Remparts de la Sqala du Port",
    city: "Essaouira",
    category: "Monument & Mer",
    description: "Ancienne fortification maritime portugaise et alaouite avec ses canons en bronze pointés vers l'Atlantique, offrant une vue magique sur l'océan et les vagues.",
    budgetLevel: "low",
    estimatedPriceDh: 50,
  },
  {
    id: 11,
    name: "Ksar d'Aït Benhaddou",
    city: "Ouarzazate",
    category: "Patrimoine UNESCO",
    description: "Village fortifié traditionnel en pisé sur les contreforts de l'Atlas, célèbre décor de tournage de chefs-d'œuvre cinématographiques comme Gladiator et Game of Thrones.",
    budgetLevel: "medium",
    estimatedPriceDh: 50,
  },
  {
    id: 12,
    name: "Dunes de l'Erg Chebbi",
    city: "Merzouga",
    category: "Désert & Aventure",
    description: "Immenses dunes dorées du Sahara culminant à 150 mètres. Balade à dos de dromadaire au coucher du soleil et nuit sous tente berbère sous une voûte céleste étoilée.",
    budgetLevel: "high",
    estimatedPriceDh: 600,
  },
];

const seedPinecone = async () => {
  try {
    console.log(`🌲 Début de l'indexation dans Pinecone sur l'index "${PINECONE_INDEX_NAME}"...`);
    console.log(`🧠 Modèle d'inférence utilisé : "${EMBEDDING_MODEL}" (1024 dimensions, NVIDIA)`);

    const records = [];

    for (let i = 0; i < moroccoPlaces.length; i++) {
      const place = moroccoPlaces[i];
      const textToEmbed = `${place.name} situé à ${place.city} (${place.category}) : ${place.description} Budget estimé : ${place.estimatedPriceDh} DH.`;

      console.log(`⏳ Vectorisation [${i + 1}/${moroccoPlaces.length}] : ${place.name} (${place.city})...`);

      // Génération de l'embedding 1024 dimensions avec llama-text-embed-v2
      const embedResponse = await pc.inference.embed({
        model: EMBEDDING_MODEL,
        inputs: [textToEmbed],
        parameters: {
          inputType: "passage",
          truncate: "END",
        },
      });

      const vector = embedResponse.data[0].values;

      records.push({
        id: `place_${place.id}`,
        values: vector,
        metadata: {
          id: place.id,
          name: place.name,
          city: place.city,
          category: place.category,
          estimatedPriceDh: place.estimatedPriceDh,
          budgetLevel: place.budgetLevel,
          description: place.description,
        },
      });
    }

    // Upsert des enregistrements dans Pinecone
    console.log(`🚀 Envoi de ${records.length} vecteurs vers l'index Pinecone...`);
    await index.upsert({ records });

    console.log("✅ SUCCÈS ! Tous les lieux ont été vectorisés et indexés dans Pinecone !");

    // Vérification rapide avec une requête de test
    console.log("🔍 Test de vérification sémantique :");
    const testQuery = "Je cherche une activité de randonnée dans la nature et des cascades";
    const testEmbed = await pc.inference.embed({
      model: EMBEDDING_MODEL,
      inputs: [testQuery],
      parameters: { inputType: "query", truncate: "END" },
    });

    const searchResult = await index.query({
      vector: testEmbed.data[0].values,
      topK: 2,
      includeMetadata: true,
    });

    searchResult.matches.forEach((m, idx) => {
      console.log(`   #${idx + 1} ${m.metadata.name} (${m.metadata.city}) - Score similarité: ${(m.score * 100).toFixed(1)}%`);
    });

    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur pendant l'indexation Pinecone :", err);
    process.exit(1);
  }
};

seedPinecone();
