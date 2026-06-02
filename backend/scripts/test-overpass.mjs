import { getLimaRecyclingPoints } from '../src/services/overpass.service.js';

const data = await getLimaRecyclingPoints();
console.log('OK total:', data.total, 'criticalZones:', data.criticalZones);
