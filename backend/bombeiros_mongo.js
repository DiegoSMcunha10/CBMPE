

use bombeiros_db;

// ========================
// usuarios
// ========================
db.usuarios.insertMany([
  {
    _id: 1,
    nome: "João Pereira",
    email: "joao@bombeiros.gov.br",
    senha_hash: "$2a$10$hashsimulada1",
    cargo: "Administrador",
    criado_em: ISODate("2025-10-18T00:00:00Z")
  },
  {
    _id: 2,
    nome: "Maria Silva",
    email: "maria@bombeiros.gov.br",
    senha_hash: "$2a$10$hashsimulada2",
    cargo: "Bombeiro",
    criado_em: ISODate("2025-10-18T00:00:00Z")
  },
  {
    _id: 3,
    nome: "Carlos Mendes",
    email: "carlos@bombeiros.gov.br",
    senha_hash: "$2a$10$hashsimulada3",
    cargo: "Analista",
    criado_em: ISODate("2025-10-18T00:00:00Z")
  }
]);

// ========================
// tipos_ocorrencia
// ========================
db.tipos_ocorrencia.insertMany([
  { _id: 1, nome: "Incêndio Residencial", descricao: "Ocorrência de fogo em residência urbana." },
  { _id: 2, nome: "Acidente de Trânsito", descricao: "Colisão ou capotamento em via pública." },
  { _id: 3, nome: "Resgate em Altura", descricao: "Resgate de vítima em locais elevados." },
  { _id: 4, nome: "Afogamento", descricao: "Ocorrência em ambiente aquático." },
  { _id: 5, nome: "Desabamento", descricao: "Desmoronamento de estrutura civil." },
  { _id: 6, nome: "Emergência Médica", descricao: "Atendimento de urgência por causas clínicas." }
]);

// ========================
// ocorrencias
// ========================
db.ocorrencias.insertMany([
  {
    _id: 1,
    tipo_ocorrencia: { id: 1, nome: "Incêndio Residencial" },
    usuario: { id: 2, nome: "Maria Silva" },
    data_ocorrencia: ISODate("2025-10-15T22:30:00Z"),
    descricao: "Incêndio em residência no bairro central. Chamas controladas após 40 minutos.",
    status: "Finalizada",
    local: {
      logradouro: "Rua do Sol",
      numero: "210",
      bairro: "Boa Vista",
      cidade: "Recife",
      estado: "PE",
      cep: "50050-120",
      coordenadas: "-8.0628,-34.8809"
    },
    envolvidos: [
      {
        nome: "José Almeida",
        idade: 45,
        tipo_envolvimento: "Morador",
        estado_saude: "Ferido leve",
        observacoes: "Inalou fumaça, recebeu oxigênio."
      },
      {
        nome: "Ana Souza",
        idade: 39,
        tipo_envolvimento: "Moradora",
        estado_saude: "Ilesa",
        observacoes: "Saiu da residência antes do fogo se alastrar."
      }
    ],
    criado_em: ISODate("2025-10-18T00:00:00Z")
  },
  {
    _id: 2,
    tipo_ocorrencia: { id: 2, nome: "Acidente de Trânsito" },
    usuario: { id: 3, nome: "Carlos Mendes" },
    data_ocorrencia: ISODate("2025-10-16T09:10:00Z"),
    descricao: "Acidente entre dois veículos em avenida movimentada. Vítima com ferimentos leves.",
    status: "Finalizada",
    local: {
      logradouro: "Avenida Agamenon Magalhães",
      numero: "1550",
      bairro: "Derby",
      cidade: "Recife",
      estado: "PE",
      cep: "52010-040",
      coordenadas: "-8.0465,-34.8971"
    },
    envolvidos: [
      {
        nome: "Lucas Pereira",
        idade: 30,
        tipo_envolvimento: "Motorista",
        estado_saude: "Ferido leve",
        observacoes: "Corte na testa."
      }
    ],
    criado_em: ISODate("2025-10-18T00:00:00Z")
  },
  {
    _id: 3,
    tipo_ocorrencia: { id: 4, nome: "Afogamento" },
    usuario: { id: 2, nome: "Maria Silva" },
    data_ocorrencia: ISODate("2025-10-17T15:45:00Z"),
    descricao: "Afogamento em praia de Boa Viagem. Vítima resgatada consciente.",
    status: "Finalizada",
    local: {
      logradouro: "Praia de Boa Viagem",
      numero: "s/n",
      bairro: "Boa Viagem",
      cidade: "Recife",
      estado: "PE",
      cep: "51021-100",
      coordenadas: "-8.1300,-34.9003"
    },
    envolvidos: [
      {
        nome: "Mariana Lopes",
        idade: 25,
        tipo_envolvimento: "Vítima",
        estado_saude: "Consciente",
        observacoes: "Resgatada por equipe aquática."
      }
    ],
    criado_em: ISODate("2025-10-18T00:00:00Z")
  },
  {
    _id: 4,
    tipo_ocorrencia: { id: 3, nome: "Resgate em Altura" },
    usuario: { id: 2, nome: "Maria Silva" },
    data_ocorrencia: ISODate("2025-10-17T20:00:00Z"),
    descricao: "Resgate de animal em altura. Gato preso em árvore alta.",
    status: "Finalizada",
    local: {
      logradouro: "Rua da Aurora",
      numero: "385",
      bairro: "Santo Amaro",
      cidade: "Recife",
      estado: "PE",
      cep: "50040-000",
      coordenadas: "-8.0567,-34.8778"
    },
    envolvidos: [
      {
        nome: "Animal (gato)",
        tipo_envolvimento: "Animal",
        estado_saude: "Ileso",
        observacoes: "Resgatado de forma segura."
      }
    ],
    criado_em: ISODate("2025-10-18T00:00:00Z")
  },
  {
    _id: 5,
    tipo_ocorrencia: { id: 6, nome: "Emergência Médica" },
    usuario: { id: 3, nome: "Carlos Mendes" },
    data_ocorrencia: ISODate("2025-10-18T08:15:00Z"),
    descricao: "Atendimento médico a idoso com parada respiratória.",
    status: "Em andamento",
    local: {
      logradouro: "Rua Benfica",
      numero: "657",
      bairro: "Madalena",
      cidade: "Recife",
      estado: "PE",
      cep: "50720-001",
      coordenadas: "-8.0584,-34.9112"
    },
    envolvidos: [
      {
        nome: "Pedro Nunes",
        idade: 68,
        tipo_envolvimento: "Paciente",
        estado_saude: "Grave",
        observacoes: "Em reanimação pela equipe médica."
      }
    ],
    criado_em: ISODate("2025-10-18T00:00:00Z")
  }
]);
