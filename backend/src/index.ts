import conexaoMongoDb from "./config/db.js";
import { Ocorrencia } from "./models/ocorrencia.js";

async function startApp() {
    await conexaoMongoDb;

    const novoUsuario = await Ocorrencia.create({
        NomeCompleto: "José Mário da Silva",
        Telefone1: "81985492131",
        Telefone2: "12345678911",
        Obs: "Teste de obs",
        TipoOcorrencia: "Teste de ocorrencia",
        EquipeAssociada: "Equipe A"
    })

    console.log("Usuario Criado com sucesso: " + novoUsuario)
}

startApp();