import { Router } from "express";
import { criarOcorrencia, FinalizarOcorrencia, listarOcorrencias } from "../controllers/OcorrenciaControllers.js";

const router = Router();

router.get('/listar', listarOcorrencias)

router.post('/criar', criarOcorrencia)

router.post('/finalizar', FinalizarOcorrencia)

export default router;