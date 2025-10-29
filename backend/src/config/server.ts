import express from 'express';
import dotenv from 'dotenv';
import conexaoMongoDb from './db.js';
import OcorrenciasRouter from '../routes/OcorrenciaRoutes.js';
import cors from 'cors';
import { criarENV } from '../utils/CriarENV.js';


criarENV();

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/ocorrencias', OcorrenciasRouter);

const PORT = 3000;

conexaoMongoDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });}).catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
});