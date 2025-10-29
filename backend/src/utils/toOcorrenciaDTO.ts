import type { Iocorrencias } from "../models/ocorrencia.js";
import type { OcorrenciaResponseDTO } from "../types/ocorrenciaResponseDTO.js";

export function toOcorrenciaResponseDTO(entity: Iocorrencias): OcorrenciaResponseDTO {
  return {
    id: entity.id.toString(),
    NomeCompleto: entity.NomeCompleto,
    Telefone1: entity.Telefone1,
    Telefone2: entity.Telefone2 ?? "",
    Obs: entity.Obs,
    Status: entity.Status,
    data_hora: entity.data_hora,  
    TipoOcorrencia: entity.TipoOcorrencia,
    EquipeAssociada: entity.EquipeAssociada
  };
}