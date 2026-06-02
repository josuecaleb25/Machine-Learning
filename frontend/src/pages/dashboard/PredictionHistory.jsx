import { useState, useEffect } from 'react';
import { usePredictions } from '../../hooks/usePredictions';
import './PredictionHistory.css';

// Mapeo de colores para las categorías
const getCategoryColor = (categoria) => {
  const colors = {
    'PLASTICO': '#10b981',
    'CARTON':   '#68fcbf',
    'VIDRIO':   '#4edea3',
    'ORGANICO': '#306d58',
  };
  return colors[categoria] || '#6b7280';
};

// Etiqueta legible de la categoría
const getCategoryLabel = (categoria) => {
  const labels = {
    'PLASTICO': 'Plástico',
    'CARTON':   'Cartón',
    'VIDRIO':   'Vidrio',
    'ORGANICO': 'Orgánico',
  };
  return labels[categoria] || categoria;
};

// Estado de reciclaje según categoría
const getCategoryStatus = (categoria) => {
  return categoria === 'ORGANICO' ? 'Compostable' : 'Reciclable';
};

export default function PredictionHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [allPredictions, setAllPredictions] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  
  const { predictions, loading, fetchPredictions, deletePrediction } = usePredictions();
  
  const itemsPerPage = 10;

  // Cargar todas las predicciones al montar
  useEffect(() => {
    const loadAllPredictions = async () => {
      try {
        const result = await fetchPredictions(100, 0); // Cargar más registros
        setAllPredictions(result.items || []);
      } catch (error) {
        console.error('Error loading predictions:', error);
      }
    };
    loadAllPredictions();
  }, [fetchPredictions]);

  // Filtrar predictions basado en búsqueda y categoría
  useEffect(() => {
    const filtered = allPredictions.filter((item) => {
      const label = getCategoryLabel(item.categoria).toLowerCase();
      const matchesSearch =
        item.residuoDetectado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        label.includes(searchTerm.toLowerCase());
      const matchesFilter = filterCategory === 'all' || item.categoria === filterCategory;
      return matchesSearch && matchesFilter;
    });
    setFilteredHistory(filtered);
    setCurrentPage(1);
  }, [allPredictions, searchTerm, filterCategory]);

  // Formatear datos para la tabla
  const formatPredictionForTable = (prediction) => {
    const confianzaPct = Math.round((prediction.confianza ?? 0) * 100);
    return {
      id: prediction.id,
      timestamp: new Date(prediction.createdAt).toLocaleString('es-ES'),
      category: getCategoryLabel(prediction.categoria),
      confidence: confianzaPct,
      deteccion: prediction.residuoDetectado,
      status: getCategoryStatus(prediction.categoria),
      color: getCategoryColor(prediction.categoria),
    };
  };

  // Obtener elementos de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handleDeletePrediction = async (predictionId) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta predicción?')) {
      try {
        await deletePrediction(predictionId);
        setAllPredictions(prev => prev.filter(p => p.id !== predictionId));
      } catch (error) {
        alert('Error al eliminar la predicción');
      }
    }
  };

  return (
    <div className="ph-page content-container">
      {/* Header */}
      <header className="ph-header">
        <div>
          <h2 className="ph-title">Historial de Predicciones</h2>
          <p className="ph-subtitle">
            Registro completo de clasificaciones realizadas por el modelo de IA
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
              placeholder="Buscar por categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ph-search-input"
            />
          </div>
          <div className="ph-filter-buttons">
            <button type="button" className={`ph-filter-btn ${filterCategory === 'all' ? 'active' : ''}`} onClick={() => setFilterCategory('all')}>Todas</button>
            <button type="button" className={`ph-filter-btn ${filterCategory === 'PLASTICO' ? 'active' : ''}`} onClick={() => setFilterCategory('PLASTICO')}>Plástico</button>
            <button type="button" className={`ph-filter-btn ${filterCategory === 'VIDRIO' ? 'active' : ''}`} onClick={() => setFilterCategory('VIDRIO')}>Vidrio</button>
            <button type="button" className={`ph-filter-btn ${filterCategory === 'CARTON' ? 'active' : ''}`} onClick={() => setFilterCategory('CARTON')}>Cartón</button>
            <button type="button" className={`ph-filter-btn ${filterCategory === 'ORGANICO' ? 'active' : ''}`} onClick={() => setFilterCategory('ORGANICO')}>Orgánico</button>
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
        </div>

        {loading ? (
          <div className="ph-loading">
            <p>Cargando historial...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="ph-empty">
            <span className="material-symbols-outlined">history</span>
            <h3>No hay registros</h3>
            <p>Aún no has realizado predicciones de residuos</p>
          </div>
        ) : (
          <>
            <div className="ph-history-table">
              <div className="ph-table-header">
                <div className="ph-th ph-th-id">ID</div>
                <div className="ph-th ph-th-timestamp">Fecha y Hora</div>
                <div className="ph-th ph-th-category">Categoría</div>
                <div className="ph-th ph-th-confidence">Confianza</div>
                <div className="ph-th ph-th-image">Detección</div>
                <div className="ph-th ph-th-status">Estado</div>
                <div className="ph-th ph-th-actions">Acciones</div>
              </div>

              <div className="ph-table-body">
                {currentItems.map((item) => {
                  const formattedItem = formatPredictionForTable(item);
                  return (
                    <div key={item.id} className="ph-table-row">
                      <div className="ph-td ph-td-id">#{item.id.toString().padStart(4, '0')}</div>
                      <div className="ph-td ph-td-timestamp">
                        <span className="material-symbols-outlined">schedule</span>
                        {formattedItem.timestamp}
                      </div>
                      <div className="ph-td ph-td-category">
                        <span
                          className="ph-category-badge"
                          style={{
                            background: `${formattedItem.color}20`,
                            color: formattedItem.color,
                            borderColor: `${formattedItem.color}40`,
                          }}
                        >
                          {formattedItem.category}
                        </span>
                      </div>
                      <div className="ph-td ph-td-confidence">
                        <div className="ph-confidence-bar-container">
                          <div
                            className="ph-confidence-bar"
                            style={{
                              width: `${formattedItem.confidence}%`,
                              background: formattedItem.color,
                            }}
                          />
                        </div>
                        <span className="ph-confidence-text">{formattedItem.confidence}%</span>
                      </div>
                      <div className="ph-td ph-td-image">
                        <span className="material-symbols-outlined">image</span>
                        {formattedItem.deteccion}
                      </div>
                      <div className="ph-td ph-td-status">
                        <span className="ph-status-badge-small success">
                          <span className="material-symbols-outlined">check_circle</span>
                          {formattedItem.status}
                        </span>
                      </div>
                      <div className="ph-td ph-td-actions">
                        <button
                          type="button"
                          className="ph-action-btn delete"
                          onClick={() => handleDeletePrediction(item.id)}
                          title="Eliminar registro"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="ph-pagination">
                <button
                  type="button"
                  className="ph-pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                  Anterior
                </button>
                
                <div className="ph-pagination-info">
                  Página {currentPage} de {totalPages}
                </div>
                
                <button
                  type="button"
                  className="ph-pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
