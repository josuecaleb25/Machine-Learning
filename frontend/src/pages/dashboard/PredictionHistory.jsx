import { useState } from 'react';
import './PredictionHistory.css';

const PREDICTION_HISTORY = [
  {
    id: 1,
    timestamp: '2024-06-02 14:32:18',
    category: 'Plástico PET',
    confidence: 98.5,
    image: 'bottle_001.jpg',
    status: 'Reciclable',
    color: '#10b981',
  },
  {
    id: 2,
    timestamp: '2024-06-02 14:28:45',
    category: 'Vidrio',
    confidence: 96.2,
    image: 'glass_jar_012.jpg',
    status: 'Reciclable',
    color: '#4edea3',
  },
  {
    id: 3,
    timestamp: '2024-06-02 14:25:11',
    category: 'Papel/Cartón',
    confidence: 94.8,
    image: 'cardboard_box_003.jpg',
    status: 'Reciclable',
    color: '#68fcbf',
  },
  {
    id: 4,
    timestamp: '2024-06-02 14:21:33',
    category: 'Metal/Aluminio',
    confidence: 91.3,
    image: 'can_aluminum_008.jpg',
    status: 'Reciclable',
    color: '#95d3ba',
  },
  {
    id: 5,
    timestamp: '2024-06-02 14:18:56',
    category: 'Orgánico',
    confidence: 89.7,
    image: 'apple_core_021.jpg',
    status: 'Compostable',
    color: '#306d58',
  },
  {
    id: 6,
    timestamp: '2024-06-02 14:15:22',
    category: 'Plástico PET',
    confidence: 97.1,
    image: 'bottle_002.jpg',
    status: 'Reciclable',
    color: '#10b981',
  },
  {
    id: 7,
    timestamp: '2024-06-02 14:12:08',
    category: 'Vidrio',
    confidence: 95.4,
    image: 'glass_bottle_015.jpg',
    status: 'Reciclable',
    color: '#4edea3',
  },
  {
    id: 8,
    timestamp: '2024-06-02 14:08:41',
    category: 'Papel/Cartón',
    confidence: 93.2,
    image: 'paper_sheet_007.jpg',
    status: 'Reciclable',
    color: '#68fcbf',
  },
  {
    id: 9,
    timestamp: '2024-06-02 14:05:19',
    category: 'Metal/Aluminio',
    confidence: 90.8,
    image: 'can_soda_011.jpg',
    status: 'Reciclable',
    color: '#95d3ba',
  },
  {
    id: 10,
    timestamp: '2024-06-02 14:01:47',
    category: 'Orgánico',
    confidence: 88.9,
    image: 'banana_peel_019.jpg',
    status: 'Compostable',
    color: '#306d58',
  },
  {
    id: 11,
    timestamp: '2024-06-02 13:58:15',
    category: 'Plástico PET',
    confidence: 96.7,
    image: 'bottle_003.jpg',
    status: 'Reciclable',
    color: '#10b981',
  },
  {
    id: 12,
    timestamp: '2024-06-02 13:54:32',
    category: 'Vidrio',
    confidence: 94.1,
    image: 'glass_container_009.jpg',
    status: 'Reciclable',
    color: '#4edea3',
  },
];

export default function PredictionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredHistory = PREDICTION_HISTORY.filter((item) => {
    const matchesSearch = item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.image.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="ph-page content-container">
      {/* Header */}
      <header className="ph-header">
        <div>
          <h2 className="ph-title">Historial de Predicciones</h2>
          <p className="ph-subtitle">
            Registro completo de clasificaciones realizadas por el modelo CNN
          </p>
        </div>
        <div className="ph-status-badge">
          <span className="ph-pulse-dot" />
          <span>{filteredHistory.length} REGISTROS</span>
        </div>
      </header>

      {/* Filtros y búsqueda */}
      <div className="ph-glass-card ph-filters-card">
        <div className="ph-filters-row">
          <div className="ph-search-box">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Buscar por categoría o archivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ph-search-input"
            />
          </div>
          <div className="ph-filter-buttons">
            <button
              type="button"
              className={`ph-filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCategory('all')}
            >
              Todas
            </button>
            <button
              type="button"
              className={`ph-filter-btn ${filterCategory === 'Plástico PET' ? 'active' : ''}`}
              onClick={() => setFilterCategory('Plástico PET')}
            >
              Plástico
            </button>
            <button
              type="button"
              className={`ph-filter-btn ${filterCategory === 'Vidrio' ? 'active' : ''}`}
              onClick={() => setFilterCategory('Vidrio')}
            >
              Vidrio
            </button>
            <button
              type="button"
              className={`ph-filter-btn ${filterCategory === 'Papel/Cartón' ? 'active' : ''}`}
              onClick={() => setFilterCategory('Papel/Cartón')}
            >
              Papel
            </button>
            <button
              type="button"
              className={`ph-filter-btn ${filterCategory === 'Metal/Aluminio' ? 'active' : ''}`}
              onClick={() => setFilterCategory('Metal/Aluminio')}
            >
              Metal
            </button>
            <button
              type="button"
              className={`ph-filter-btn ${filterCategory === 'Orgánico' ? 'active' : ''}`}
              onClick={() => setFilterCategory('Orgánico')}
            >
              Orgánico
            </button>
          </div>
        </div>
      </div>

      {/* Historial de predicciones */}
      <div className="ph-glass-card ph-history-card">
        <div className="ph-history-header">
          <div>
            <h3 className="ph-chart-title">Registros de Clasificación</h3>
            <p className="ph-history-count">{filteredHistory.length} predicciones encontradas</p>
          </div>
          <button type="button" className="ph-export-btn">
            <span className="material-symbols-outlined">download</span>
            Exportar CSV
          </button>
        </div>

        <div className="ph-history-table">
          <div className="ph-table-header">
            <div className="ph-th ph-th-id">ID</div>
            <div className="ph-th ph-th-timestamp">Fecha y Hora</div>
            <div className="ph-th ph-th-category">Categoría</div>
            <div className="ph-th ph-th-confidence">Confianza</div>
            <div className="ph-th ph-th-image">Archivo</div>
            <div className="ph-th ph-th-status">Estado</div>
          </div>

          <div className="ph-table-body">
            {filteredHistory.map((item) => (
              <div key={item.id} className="ph-table-row">
                <div className="ph-td ph-td-id">#{item.id.toString().padStart(4, '0')}</div>
                <div className="ph-td ph-td-timestamp">
                  <span className="material-symbols-outlined">schedule</span>
                  {item.timestamp}
                </div>
                <div className="ph-td ph-td-category">
                  <span
                    className="ph-category-badge"
                    style={{
                      background: `${item.color}20`,
                      color: item.color,
                      borderColor: `${item.color}40`,
                    }}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="ph-td ph-td-confidence">
                  <div className="ph-confidence-bar-container">
                    <div
                      className="ph-confidence-bar"
                      style={{
                        width: `${item.confidence}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                  <span className="ph-confidence-text">{item.confidence}%</span>
                </div>
                <div className="ph-td ph-td-image">
                  <span className="material-symbols-outlined">image</span>
                  {item.image}
                </div>
                <div className="ph-td ph-td-status">
                  <span className="ph-status-badge-small success">
                    <span className="material-symbols-outlined">check_circle</span>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
