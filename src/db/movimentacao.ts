// src/db/movimentacao.ts
import { getDb } from './database';
import type { LocalTipo } from './ferramenta';

export interface Movimentacao {
  id?: number;
  ferramenta_id: number;
  de_tipo: LocalTipo;
  de_obra_id?: number | null;
  para_tipo: LocalTipo;
  para_obra_id?: number | null;
  colaborador_id?: number | null;
  data_hora?: string; // opcional; DB seta default
  observacao?: string | null;
}

// Registra movimentação + atualiza "local/status" da ferramenta numa transação
export function registrarMovimentacao(m: Movimentacao): number {
  const db = getDb();
  const tx = db.transaction(() => {
    const r = db
      .prepare(
        `
       INSERT INTO movimentacoes (
         ferramenta_id, de_tipo, de_obra_id, para_tipo, para_obra_id, colaborador_id, data_hora, observacao
       ) VALUES (?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')), ?)
     `
      )
      .run(
        m.ferramenta_id,
        m.de_tipo,
        m.de_obra_id ?? null,
        m.para_tipo,
        m.para_obra_id ?? null,
        m.colaborador_id ?? null,
        m.data_hora ?? null,
        m.observacao ?? null
      );

    // Atualiza a ferramenta para refletir o destino
    db.prepare(
      `
       UPDATE ferramentas
       SET local_tipo = ?, local_obra_id = ?, status = ?, updated_at = datetime('now')
       WHERE id = ?
     `
    ).run(
      m.para_tipo,
      m.para_tipo === 'obra' ? m.para_obra_id ?? null : null,
      // regra simples: se foi pra obra, fica "em_uso"; se voltou pro depósito, "disponivel"
      m.para_tipo === 'obra' ? 'em_uso' : 'disponivel',
      m.ferramenta_id
    );

    return Number(r.lastInsertRowid);
  });

  return tx();
}

export function listarMovimentacoesPorFerramenta(
  ferramentaId: number
): Movimentacao[] {
  const db = getDb();
  return db
    .prepare(
      `
     SELECT * FROM movimentacoes
     WHERE ferramenta_id = ?
     ORDER BY datetime(data_hora) DESC, id DESC
   `
    )
    .all(ferramentaId) as Movimentacao[];
}
