/**
 * Calcula la similitud coseno entre dos embeddings faciales.
 * @param {number[]} embeddingA
 * @param {number[]} embeddingB
 * @returns {number} Valor entre -1 y 1 (1 = idénticos)
 */
export function compareFaceEmbeddings(embeddingA, embeddingB) {
  if (!Array.isArray(embeddingA) || !Array.isArray(embeddingB)) {
    throw new Error('Los embeddings deben ser arreglos numéricos');
  }
  if (embeddingA.length !== embeddingB.length || embeddingA.length === 0) {
    return 0;
  }

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < embeddingA.length; i++) {
    const a = Number(embeddingA[i]);
    const b = Number(embeddingB[i]);
    if (Number.isNaN(a) || Number.isNaN(b)) {
      throw new Error('El embedding contiene valores no numéricos');
    }
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  if (magnitude === 0) return 0;

  return dot / magnitude;
}

/**
 * Clasifica todos los usuarios por similitud facial (mayor a menor).
 * @param {number[]} probeEmbedding
 * @param {Array<{ id: string, facialEmbedding: unknown, nombre?: string }>} users
 * @returns {Array<{ user: object, similarity: number }>}
 */
export function rankFaceMatches(probeEmbedding, users) {
  const matches = [];

  for (const user of users) {
    const stored = user.facialEmbedding;
    if (!stored || !Array.isArray(stored)) continue;

    const similarity = compareFaceEmbeddings(probeEmbedding, stored);
    matches.push({ user, similarity });
  }

  return matches.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Evalúa si un rostro coincide de forma confiable con un usuario registrado.
 * Incluye validación anti-falsos positivos (margen mínimo sobre el segundo mejor match).
 *
 * @param {number[]} probeEmbedding
 * @param {Array<{ id: string, facialEmbedding: unknown }>} users
 * @param {number} threshold - Umbral mínimo de similitud coseno (0–1)
 * @param {number} margin - Margen mínimo entre el 1.º y 2.º candidato
 * @returns {{
 *   accepted: boolean,
 *   reason?: 'no_users' | 'below_threshold' | 'ambiguous',
 *   user?: object,
 *   similarity?: number,
 *   best?: { user: object, similarity: number },
 *   second?: { user: object, similarity: number },
 *   gap?: number,
 *   ranked: Array<{ user: object, similarity: number }>
 * }}
 */
export function evaluateFaceMatch(probeEmbedding, users, threshold, margin = 0.06) {
  const ranked = rankFaceMatches(probeEmbedding, users);

  if (ranked.length === 0) {
    return { accepted: false, reason: 'no_users', ranked };
  }

  const best = ranked[0];

  if (best.similarity < threshold) {
    return { accepted: false, reason: 'below_threshold', best, ranked };
  }

  if (ranked.length > 1) {
    const second = ranked[1];
    const gap = best.similarity - second.similarity;
    if (gap < margin) {
      return { accepted: false, reason: 'ambiguous', best, second, gap, ranked };
    }
  }

  return {
    accepted: true,
    user: best.user,
    similarity: best.similarity,
    ranked,
  };
}

/**
 * Busca el usuario con mayor similitud facial que supere el umbral y el margen anti-ambigüedad.
 * @param {number[]} probeEmbedding
 * @param {Array<{ id: string, facialEmbedding: unknown }>} users
 * @param {number} threshold
 * @param {number} [margin=0.06]
 * @returns {{ user: object, similarity: number } | null}
 */
export function findMatchingUser(probeEmbedding, users, threshold, margin = 0.06) {
  const result = evaluateFaceMatch(probeEmbedding, users, threshold, margin);
  if (!result.accepted) return null;
  return { user: result.user, similarity: result.similarity };
}

/**
 * Verifica si el embedding ya está registrado (duplicado).
 * Usa el umbral estricto sin margen: cualquier coincidencia alta es duplicado.
 */
export function findDuplicateUser(probeEmbedding, users, threshold) {
  const ranked = rankFaceMatches(probeEmbedding, users);
  if (ranked.length === 0) return null;
  const best = ranked[0];
  if (best.similarity >= threshold) {
    return { user: best.user, similarity: best.similarity };
  }
  return null;
}

export function formatSimilarityPct(similarity) {
  return `${(similarity * 100).toFixed(1)}%`;
}

export function parseEmbedding(raw) {
  if (Array.isArray(raw)) {
    if (raw.length === 0) throw new Error('El embedding facial no puede estar vacío');
    return raw.map(Number);
  }
  throw new Error('Formato de embedding facial inválido');
}
