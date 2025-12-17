import { contextBridge, ipcRenderer } from 'electron';

const api = {
  // =========================
  // OBRAS
  // =========================
  criarObra: (obra: any) => ipcRenderer.invoke('criarObra', obra),
  listarObras: () => ipcRenderer.invoke('listarObras'),
  buscarObraPorId: (id: number) => ipcRenderer.invoke('buscarObraPorId', id),
  atualizarObra: (obra: any) => ipcRenderer.invoke('atualizarObra', obra),
  deletarObra: (id: number) => ipcRenderer.invoke('deletarObra', id),

  // =========================
  // COLABORADORES
  // =========================
  criarColaborador: (colaborador: any) =>
    ipcRenderer.invoke('criarColaborador', colaborador),
  listarColaboradores: () => ipcRenderer.invoke('listarColaboradores'),
  atualizarColaborador: (colaborador: any) =>
    ipcRenderer.invoke('atualizarColaborador', colaborador),
  deletarColaborador: (id: number) =>
    ipcRenderer.invoke('deletarColaborador', id),

  // =========================
  // FERRAMENTAS
  // =========================
  criarFerramenta: (ferramenta: any) =>
    ipcRenderer.invoke('criarFerramenta', ferramenta),
  listarFerramentas: () => ipcRenderer.invoke('listarFerramentas'),
  buscarFerramentaPorId: (id: number) =>
    ipcRenderer.invoke('buscarFerramentaPorId', id),
  atualizarFerramenta: (ferramenta: any) =>
    ipcRenderer.invoke('atualizarFerramenta', ferramenta),
  deletarFerramenta: (id: number) =>
    ipcRenderer.invoke('deletarFerramenta', id),

  // =========================
  // MOVIMENTAÇÕES
  // =========================
  registrarMovimentacao: (movimentacao: any) =>
    ipcRenderer.invoke('registrarMovimentacao', movimentacao),
  listarMovimentacoesPorFerramenta: (ferramentaId: number) =>
    ipcRenderer.invoke('listarMovimentacoesPorFerramenta', ferramentaId),
};

contextBridge.exposeInMainWorld('api', api);
