// src/db/colaborador.ts
import { getDb } from './database';

export interface Colaborador {
  id?: number;
  nome: string;
  matricula?: string | null;
  funcao?: string | null;
  telefone?: string | null;
  ativo?: 0 | 1;
}

export function criarColaborador(c: Colaborador): number {
  const db = getDb();
  const r = db
    .prepare(
      `
     INSERT INTO colaboradores (nome, matricula, funcao, telefone, ativo)
     VALUES (?, ?, ?, ?, ?)
   `
    )
    .run(
      c.nome,
      c.matricula ?? null,
      c.funcao ?? null,
      c.telefone ?? null,
      c.ativo ?? 1
    );
  return Number(r.lastInsertRowid);
}

export function listarColaboradores(): Colaborador[] {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM colaboradores ORDER BY nome ASC`)
    .all() as Colaborador[];
}

export function atualizarColaborador(c: Colaborador): void {
  if (!c.id) throw new Error('Colaborador sem id');
  const db = getDb();
  db.prepare(
    `
     UPDATE colaboradores
     SET nome = ?, matricula = ?, funcao = ?, telefone = ?, ativo = ?, updated_at = datetime('now')
     WHERE id = ?
   `
  ).run(
    c.nome,
    c.matricula ?? null,
    c.funcao ?? null,
    c.telefone ?? null,
    c.ativo ?? 1,
    c.id
  );
}

export function deletarColaborador(id: number): void {
  const db = getDb();
  db.prepare(`DELETE FROM colaboradores WHERE id = ?`).run(id);
}
