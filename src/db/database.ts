// src/db/database.ts
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

let dbInstance: Database.Database | null = null;

export function initializeDatabase(dbPath: string) {
  // garante a pasta do arquivo
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // =========================
  // TABELA: colaboradores
  // =========================
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS colaboradores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      matricula TEXT,
      funcao TEXT,
      telefone TEXT,
      ativo INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );
  `
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_colaboradores_nome ON colaboradores(nome);`
  ).run();
  db.prepare(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_colaboradores_matricula ON colaboradores(matricula) WHERE matricula IS NOT NULL;`
  ).run();

  // =========================
  // TABELA: obras
  // =========================
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS obras (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      codigo TEXT,
      endereco TEXT,
      status TEXT NOT NULL DEFAULT 'ativa', -- ativa | pausada | finalizada
      observacoes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT
    );
  `
  ).run();

  db.prepare(`CREATE INDEX IF NOT EXISTS idx_obras_nome ON obras(nome);`).run();
  db.prepare(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_obras_codigo ON obras(codigo) WHERE codigo IS NOT NULL;`
  ).run();

  // =========================
  // TABELA: ferramentas
  // =========================
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS ferramentas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      codigo_patrimonio TEXT,     -- etiqueta / patrimônio
      categoria TEXT,
      marca TEXT,
      modelo TEXT,
      numero_serie TEXT,
      status TEXT NOT NULL DEFAULT 'disponivel',
      -- disponivel | em_uso | manutencao | perdida | baixada

      local_tipo TEXT NOT NULL DEFAULT 'deposito',
      -- deposito | obra
      local_obra_id INTEGER, -- se local_tipo = 'obra'

      observacoes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT,

      FOREIGN KEY (local_obra_id) REFERENCES obras(id) ON UPDATE CASCADE ON DELETE SET NULL
    );
  `
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_ferramentas_nome ON ferramentas(nome);`
  ).run();
  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_ferramentas_status ON ferramentas(status);`
  ).run();
  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_ferramentas_local ON ferramentas(local_tipo, local_obra_id);`
  ).run();
  db.prepare(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_ferramentas_patrimonio ON ferramentas(codigo_patrimonio) WHERE codigo_patrimonio IS NOT NULL;`
  ).run();

  // =========================
  // TABELA: movimentacoes
  // =========================
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ferramenta_id INTEGER NOT NULL,

      de_tipo TEXT NOT NULL,          -- deposito | obra
      de_obra_id INTEGER,             -- se de_tipo = obra

      para_tipo TEXT NOT NULL,        -- deposito | obra
      para_obra_id INTEGER,           -- se para_tipo = obra

      colaborador_id INTEGER,          -- quem executou/recebeu
      data_hora TEXT NOT NULL DEFAULT (datetime('now')),
      observacao TEXT,
 
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
 
      FOREIGN KEY (ferramenta_id) REFERENCES ferramentas(id) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (de_obra_id) REFERENCES obras(id) ON UPDATE CASCADE ON DELETE SET NULL,
      FOREIGN KEY (para_obra_id) REFERENCES obras(id) ON UPDATE CASCADE ON DELETE SET NULL,
      FOREIGN KEY (colaborador_id) REFERENCES colaboradores(id) ON UPDATE CASCADE ON DELETE SET NULL
    );
   `
  ).run();

  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_mov_ferramenta ON movimentacoes(ferramenta_id, data_hora DESC);`
  ).run();
  db.prepare(
    `CREATE INDEX IF NOT EXISTS idx_mov_para ON movimentacoes(para_tipo, para_obra_id, data_hora DESC);`
  ).run();

  dbInstance = db;
  return db;
}

export function getDb(): Database.Database {
  if (!dbInstance) throw new Error('Banco de dados não inicializado!');
  return dbInstance;
}
