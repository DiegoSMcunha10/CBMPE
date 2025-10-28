import mongoose from "mongoose";

async function conexaoMongoDb() {
  try {
    await mongoose.connect("mongodb+srv://teste:m6iMH0LYJBA7fDq1@cluster0.fjicpcq.mongodb.net/bancocbmpe");
    console.log("✅ Conectado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao conectar:", error);
  }
}

export default conexaoMongoDb;
