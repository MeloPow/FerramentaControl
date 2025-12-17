import { getDb } from './database';

export type ObraStatus = 'ativa' | 'pausada' | 'finalizada';

export interface Obra {
  id?: number;
  nome: string;
  codigo?: string | null;
  endereco?: string | null;
  status?: ObraStatus;
  observacoes?: string | null;
}

export function criarObra(obra: Obra): number {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO obras (nome, codigo, endereco, status, observacoes)
    VALUES (?, ?, ?, ?, ?)
  `);

  const r = stmt.run(
    obra.nome,
    obra.codigo ?? null,
    obra.endereco ?? null,
    obra.status ?? 'ativa',
    obra.observacoes ?? null
  );

  return Number(r.lastInsertRowid);
}

export function listarObras(): Obra[] {
  const db = getDb();
  return db.prepare(`SELECT * FROM obras ORDER BY nome ASC`).all() as Obra[];
}

export function buscarObraPorId(id: number): Obra | undefined {
  const db = getDb();
  return db.prepare(`SELECT * FROM obras WHERE id = ?`).get(id) as
    | Obra
    | undefined;
}

export function atualizarObra(obra: Obra): void {
  if (!obra.id) throw new Error('Obra sem id');

  const db = getDb();
  db.prepare(
    `
    UPDATE obras
    SET nome = ?, codigo = ?, endereco = ?, status = ?, observacoes = ?, updated_at = datetime('now')
    WHERE id = ?
  `
  ).run(
    obra.nome,
    obra.codigo ?? null,
    obra.endereco ?? null,
    obra.status ?? 'ativa',
    obra.observacoes ?? null,
    obra.id
  );
}

export function deletarObra(id: number): void {
  const db = getDb();
  db.prepare(`DELETE FROM obras WHERE id = ?`).run(id);
}
