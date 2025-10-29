import fs from "fs";
import path from "path";

export function criarENV() {
  const envPath = path.resolve(".env");

  const envContent =
    "MONGODB_URI=mongodb+srv://teste:m6iMH0LYJBA7fDq1@cluster0.fjicpcq.mongodb.net/bancocbmpe";

  // Verifica se o arquivo existe
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent, { encoding: "utf8" });
    console.log(".env criado com sucesso!");
  } else {
    console.log(".env já existe, nada feito.");
  }
}
