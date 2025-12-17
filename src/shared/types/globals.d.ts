export {};

declare global {
  // =========================
  // Tipos do domínio
  // =========================
  type ObraStatus = 'ativa' | 'pausada' | 'finalizada';

  interface Obra {
    id?: number;
    nome: string;
    codigo?: string | null;
    endereco?: string | null;
    status?: ObraStatus;
    observacoes?: string | null;
    created_at?: string;
    updated_at?: string | null;
  }

  interface Colaborador {
    id?: number;
    nome: string;
    matricula?: string | null;
    funcao?: string | null;
    telefone?: string | null;
    ativo?: 0 | 1;
    created_at?: string;
    updated_at?: string | null;
  }

  type FerramentaStatus =
    | 'disponivel'
    | 'em_uso'
    | 'manutencao'
    | 'perdida'
    | 'baixada';

  type LocalTipo = 'deposito' | 'obra';

  interface Ferramenta {
    id?: number;
    nome: string;
    codigo_patrimonio?: string | null;
    categoria?: string | null;
    marca?: string | null;
    modelo?: string | null;
    numero_serie?: string | null;
    status?: FerramentaStatus;

    local_tipo?: LocalTipo;
    local_obra_id?: number | null;

    observacoes?: string | null;
    created_at?: string;
    updated_at?: string | null;
  }

  interface Movimentacao {
    id?: number;
    ferramenta_id: number;

    de_tipo: LocalTipo;
    de_obra_id?: number | null;

    para_tipo: LocalTipo;
    para_obra_id?: number | null;

    colaborador_id?: number | null;

    data_hora?: string; // DB define default datetime('now')
    observacao?: string | null;

    created_at?: string;
  }

  // =========================
  // API exposta no preload
  // =========================
  interface Window {
    api: {
      // OBRAS
      criarObra: (obra: Obra) => Promise<number>;
      listarObras: () => Promise<Obra[]>;
      buscarObraPorId: (id: number) => Promise<Obra | undefined>;
      atualizarObra: (obra: Obra) => Promise<void>;
      deletarObra: (id: number) => Promise<void>;

      // COLABORADORES
      criarColaborador: (colaborador: Colaborador) => Promise<number>;
      listarColaboradores: () => Promise<Colaborador[]>;
      atualizarColaborador: (colaborador: Colaborador) => Promise<void>;
      deletarColaborador: (id: number) => Promise<void>;

      // FERRAMENTAS
      criarFerramenta: (ferramenta: Ferramenta) => Promise<number>;
      listarFerramentas: () => Promise<Ferramenta[]>;
      buscarFerramentaPorId: (id: number) => Promise<Ferramenta | undefined>;
      atualizarFerramenta: (ferramenta: Ferramenta) => Promise<void>;
      deletarFerramenta: (id: number) => Promise<void>;

      // MOVIMENTAÇÕES
      registrarMovimentacao: (movimentacao: Movimentacao) => Promise<number>;
      listarMovimentacoesPorFerramenta: (
        ferramentaId: number
      ) => Promise<Movimentacao[]>;
    };
  }
}
