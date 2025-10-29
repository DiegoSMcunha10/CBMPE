import type { Iocorrencias } from "../models/ocorrencia.js";

export type OcorrenciaResponseDTO = {
    id: string;
    NomeCompleto: string;
    Telefone1: string;
    Telefone2?: string;
    Obs: string;
    Status: string;
    data_hora: Date;
    TipoOcorrencia: string;
    EquipeAssociada: string;
}

export type OcorrenciaRequestDTO = {
    NomeCompleto: string;
    Telefone1: string;
    Telefone2?: string;
    Obs: string;
    TipoOcorrencia: string;
    EquipeAssociada: string;
}

export type EditOcorrenciaRequestDTO = {
    id: string;
    Telefone1: string;
    Telefone2?: string;
    Obs: string;
}

export type DeleteOcorrenciaRequestDTO = {
    id: string;
}