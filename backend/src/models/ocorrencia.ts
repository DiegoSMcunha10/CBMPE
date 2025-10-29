import mongoose, { Schema, Document } from "mongoose";

export interface Iocorrencias extends Document {
  NomeCompleto: string;
  Telefone1: string;
  Telefone2?: string;
  Obs: string;
  TipoOcorrencia: string;
  EquipeAssociada: string;
  Status: string;
  data_hora: Date;
}

const ocorrenciaSchema = new Schema<Iocorrencias>({
  NomeCompleto: { type: String, required: true },
  Telefone1: { type: String, required: true },
  Telefone2: { type: String, required: false },
  Obs: { type: String, required: true },
  TipoOcorrencia: { type: String, required: true },
  EquipeAssociada: { type: String, required: true },
  Status: { type: String, required: true },
  data_hora: { type: Date, required: true },
});

export const Ocorrencia = mongoose.model <Iocorrencias> ("Ocorrencias", ocorrenciaSchema)