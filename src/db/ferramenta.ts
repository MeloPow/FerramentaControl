// src/db/ferramenta.ts
import { getDb } from './database';

export type FerramentaStatus =
  | 'disponivel'
  | 'em_uso'
  | 'manutencao'
  | 'perdida'
  | 'baixada';
export type LocalTipo = 'deposito' | 'obra';

export interface Ferramenta {
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
}

export function criarFerramenta(f: Ferramenta): number {
  const db = getDb();
  const r = db
    .prepare(
      `
     INSERT INTO ferramentas (
       nome, codigo_patrimonio, categoria, marca, modelo, numero_serie,
       status, local_tipo, local_obra_id, observacoes
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
   `
    )
    .run(
      f.nome,
      f.codigo_patrimonio ?? null,
      f.categoria ?? null,
      f.marca ?? null,
      f.modelo ?? null,
      f.numero_serie ?? null,
      f.status ?? 'disponivel',
      f.local_tipo ?? 'deposito',
      f.local_obra_id ?? null,
      f.observacoes ?? null
    );
  return Number(r.lastInsertRowid);
}

export function listarFerramentas(): Ferramenta[] {
  const db = getDb();
  return db
    .prepare(`SELECT * FROM ferramentas ORDER BY nome ASC`)
    .all() as Ferramenta[];
}

export function buscarFerramentaPorId(id: number): Ferramenta | undefined {
  const db = getDb();
  return db.prepare(`SELECT * FROM ferramentas WHERE id = ?`).get(id) as
    | Ferramenta
    | undefined;
}

export function atualizarFerramenta(f: Ferramenta): void {
  if (!f.id) throw new Error('Ferramenta sem id');
  const db = getDb();
  db.prepare(
    `
     UPDATE ferramentas SET
       nome = ?, codigo_patrimonio = ?, categoria = ?, marca = ?, modelo = ?, numero_serie = ?,
       status = ?, local_tipo = ?, local_obra_id = ?, observacoes = ?, updated_at = datetime('now')
     WHERE id = ?
   `
  ).run(
    f.nome,
    f.codigo_patrimonio ?? null,
    f.categoria ?? null,
    f.marca ?? null,
    f.modelo ?? null,
    f.numero_serie ?? null,
    f.status ?? 'disponivel',
    f.local_tipo ?? 'deposito',
    f.local_obra_id ?? null,
    f.observacoes ?? null,
    f.id
  );
}

export function deletarFerramenta(id: number): void {
  const db = getDb();
  db.prepare(`DELETE FROM ferramentas WHERE id = ?`).run(id);
}
