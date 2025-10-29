import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configura dotenv com path explícito
dotenv.config();

async function conexaoMongoDb() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("Variável de ambiente MONGODB_URI não definida");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar:", error);
  }
}

export default conexaoMongoDb;
