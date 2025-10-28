import mongoose from "mongoose";
import 'dotenv/config';

async function conexaoMongoDb() {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);
    console.log("✅ Conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar:", error);
  }
}

export default conexaoMongoDb;
