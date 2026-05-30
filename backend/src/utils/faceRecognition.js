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
 * Busca el usuario con mayor similitud facial que supere el umbral.
 * @param {number[]} probeEmbedding
 * @param {Array<{ id: string, facialEmbedding: unknown }>} users
 * @param {number} threshold
 * @returns {{ user: object, similarity: number } | null}
 */
export function findMatchingUser(probeEmbedding, users, threshold) {
  let bestMatch = null;
  let bestSimilarity = threshold;

  for (const user of users) {
    const stored = user.facialEmbedding;
    if (!stored || !Array.isArray(stored)) continue;

    const similarity = compareFaceEmbeddings(probeEmbedding, stored);
    if (similarity >= bestSimilarity) {
      bestSimilarity = similarity;
      bestMatch = { user, similarity };
    }
  }

  return bestMatch;
}

/**
 * Verifica si el embedding ya está registrado (duplicado).
 */
export function findDuplicateUser(probeEmbedding, users, threshold) {
  return findMatchingUser(probeEmbedding, users, threshold);
}

export function parseEmbedding(raw) {
  if (Array.isArray(raw)) {
    if (raw.length === 0) throw new Error('El embedding facial no puede estar vacío');
    return raw.map(Number);
  }
  throw new Error('Formato de embedding facial inválido');
}
