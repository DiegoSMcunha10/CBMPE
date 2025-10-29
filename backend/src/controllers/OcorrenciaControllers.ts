import type { Request, Response } from "express";
import { Ocorrencia } from "../models/ocorrencia.js";
import type {
  DeleteOcorrenciaRequestDTO,
  EditOcorrenciaRequestDTO,
  OcorrenciaRequestDTO,
  OcorrenciaResponseDTO,
} from "../types/ocorrenciaResponseDTO.js";
import { toOcorrenciaResponseDTO } from "../utils/toOcorrenciaDTO.js";

export const listarOcorrencias = async (req: Request, res: Response) => {
  try {
    const ocorrencias = await Ocorrencia.find();
    const resposta = ocorrencias.map(toOcorrenciaResponseDTO);
    res.json(resposta);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar ocorrências" });
  }
};

export const criarOcorrencia = async (req: Request, res: Response) => {
  try {
    // tipagem do body (ajuste OcorrenciaRequestDTO se necessário)
    const {
      NomeCompleto,
      Telefone1,
      Telefone2,
      Obs,
      TipoOcorrencia,
      EquipeAssociada,
    } = req.body as OcorrenciaRequestDTO;

    // monta o documento conforme Iocorrencias (preenche defaults quando necessário)
    const novaOcorrencia = new Ocorrencia({
      NomeCompleto,
      Telefone1,
      Telefone2: Telefone2 ?? "",
      Obs,
      TipoOcorrencia,
      EquipeAssociada: EquipeAssociada ?? "",
      Status: "Em andamento",
      data_hora: new Date(),
    });

    await novaOcorrencia.save();

    // retorna DTO ou o objeto salvo
    const resposta = toOcorrenciaResponseDTO(novaOcorrencia);
    res.status(201).json(resposta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar ocorrência" });
  }
};

export const FinalizarOcorrencia = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const ocorrencia = await Ocorrencia.findById(id);
    if (!ocorrencia) {
      return res.status(404).json({ error: "Ocorrência não encontrada" });
    }
    ocorrencia.Status = "Finalizada";
    await ocorrencia.save();
    const resposta = toOcorrenciaResponseDTO(ocorrencia);
    res.json(resposta);
  } catch (err) {
    res.status(500).json({ error: "Erro ao finalizar ocorrência" });
  }
};

export const editarOcorrencia = async (req: Request, res: Response) => {
  try {
    // tipagem do body usando EditOcorrenciaRequestDTO
    const {
      id,
      Telefone1,
      Telefone2,
      Obs,
    } = req.body as EditOcorrenciaRequestDTO;

    // valida se ID foi fornecido
    if (!id) {
      return res.status(400).json({ error: "ID da ocorrência não fornecido" });
    }

    // busca ocorrência existente
    const ocorrencia = await Ocorrencia.findById(id);
    if (!ocorrencia) {
      return res.status(404).json({ error: "Ocorrência não encontrada" });
    }

    // atualiza campos (mantém status e data_hora originais)
    ocorrencia.Telefone1 = Telefone1;
    ocorrencia.Telefone2 = Telefone2 ?? "";
    ocorrencia.Obs = Obs;

    // salva alterações
    await ocorrencia.save();

    // retorna DTO atualizado
    const resposta = toOcorrenciaResponseDTO(ocorrencia);
    res.json(resposta);
  } catch (err) {
    console.error("Erro ao editar ocorrência:", err);
    res.status(500).json({ error: "Erro ao editar ocorrência" });
  }
};

export const excluirOcorrencia = async (req: Request, res: Response) => {
  try {
    const { id } = req.body as DeleteOcorrenciaRequestDTO
    const ocorrencia = await Ocorrencia.findById(id);
    if (!ocorrencia) {
      return res.status(404).json({ error: "Ocorrência não encontrada" });
    }
    await ocorrencia.deleteOne();
    res.json({ message: "Ocorrência excluída com sucesso" });
  } catch (err) {
    console.error("Erro ao excluir ocorrência:", err);
    res.status(500).json({ error: "Erro ao excluir ocorrência" });
  }
};
