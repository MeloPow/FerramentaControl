import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

import { initializeDatabase } from '../db/database';

import {
  criarObra,
  listarObras,
  buscarObraPorId,
  atualizarObra,
  deletarObra,
} from '../db/obra';

import {
  criarColaborador,
  listarColaboradores,
  atualizarColaborador,
  deletarColaborador,
} from '../db/colaborador';

import {
  criarFerramenta,
  listarFerramentas,
  buscarFerramentaPorId,
  atualizarFerramenta,
  deletarFerramenta,
} from '../db/ferramenta';

import {
  registrarMovimentacao,
  listarMovimentacoesPorFerramenta,
} from '../db/movimentacao';

// Declarações do Webpack (Electron Forge + Webpack Plugin)
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let dbPath: string;

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    title: 'FerramentaControl',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
    },
    // Dica: deixe sem icon por enquanto pra não quebrar path em dev/build.
    // Quando você organizar assets, a gente aponta isso com segurança.
    // icon: path.join(__dirname, 'assets', 'images', 'logo.png'),
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  mainWindow.once('ready-to-show', () => mainWindow.show());

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  dbPath = path.join(app.getPath('userData'), 'ferramentacontrol.db');
  initializeDatabase(dbPath);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ==============================
// IPC HANDLERS - Obras
// ==============================
ipcMain.handle('criarObra', async (_event, obra) => criarObra(obra));
ipcMain.handle('listarObras', async () => listarObras());
ipcMain.handle('buscarObraPorId', async (_event, id: number) =>
  buscarObraPorId(id)
);
ipcMain.handle('atualizarObra', async (_event, obra) => atualizarObra(obra));
ipcMain.handle('deletarObra', async (_event, id: number) => deletarObra(id));

// ==============================
// IPC HANDLERS - Colaboradores
// ==============================
ipcMain.handle('criarColaborador', async (_event, colaborador) =>
  criarColaborador(colaborador)
);
ipcMain.handle('listarColaboradores', async () => listarColaboradores());
ipcMain.handle('atualizarColaborador', async (_event, colaborador) =>
  atualizarColaborador(colaborador)
);
ipcMain.handle('deletarColaborador', async (_event, id: number) =>
  deletarColaborador(id)
);

// ==============================
// IPC HANDLERS - Ferramentas
// ==============================
ipcMain.handle('criarFerramenta', async (_event, ferramenta) =>
  criarFerramenta(ferramenta)
);
ipcMain.handle('listarFerramentas', async () => listarFerramentas());
ipcMain.handle('buscarFerramentaPorId', async (_event, id: number) =>
  buscarFerramentaPorId(id)
);
ipcMain.handle('atualizarFerramenta', async (_event, ferramenta) =>
  atualizarFerramenta(ferramenta)
);
ipcMain.handle('deletarFerramenta', async (_event, id: number) =>
  deletarFerramenta(id)
);

// ==============================
// IPC HANDLERS - Movimentações
// ==============================
ipcMain.handle('registrarMovimentacao', async (_event, mov) =>
  registrarMovimentacao(mov)
);
ipcMain.handle(
  'listarMovimentacoesPorFerramenta',
  async (_event, ferramentaId: number) =>
    listarMovimentacoesPorFerramenta(ferramentaId)
);
