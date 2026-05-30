import { loadMediaPipeFaceLandmarker } from './faceLandmarksMediaPipe.js';
import { loadFaceModels } from './faceEmbedding.js';

export async function loadAllFaceModels() {
  await Promise.all([loadFaceModels(), loadMediaPipeFaceLandmarker()]);
}
