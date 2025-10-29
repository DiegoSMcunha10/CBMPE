import { Router } from "express";
import { criarOcorrencia, editarOcorrencia, excluirOcorrencia, FinalizarOcorrencia, listarOcorrencias } from "../controllers/OcorrenciaControllers.js";

const router = Router();

router.get('/listar', listarOcorrencias)

router.post('/criar', criarOcorrencia)

router.post('/finalizar', FinalizarOcorrencia)
router.post("/editar", editarOcorrencia)
router.post("/excluir", excluirOcorrencia); // <-- rota de exclusão

export default router;