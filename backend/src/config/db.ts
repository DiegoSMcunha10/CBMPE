import mongoose from "mongoose";

async function conexaoMongoDb() {
  try {
    await mongoose.connect("");
    console.log("✅ Conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar:", error);
  }
}

export default conexaoMongoDb;
