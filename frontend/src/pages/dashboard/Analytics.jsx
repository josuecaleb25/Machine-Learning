import { useState, useEffect } from 'react';
import './Analytics.css';

// Datos para el gráfico de tendencia
const TREND_DATA = [
  { year: 2021, plastico: 235, carton: 553, vidrio: 122, organico: 575 },
  { year: 2022, plastico: 251, carton: 588, vidrio: 125, organico: 595 },
  { year: 2023, plastico: 271, carton: 589, vidrio: 131, organico: 630 },
  { year: 2024, plastico: 297, carton: 616, vidrio: 142, organico: 658 },
  { year: 2025, plastico: 319, carton: 649, vidrio: 148, organico: 685 },
];

// Datos para el gráfico de barras (total acumulado)
const TOTAL_DATA = {
  plastico: 1373,
  carton: 2995,
  vidrio: 668,
  organico: 3143,
};

// Datos para el gráfico circular (porcentajes)
const PIE_DATA = [
  { categoria: 'Plástico', porcentaje: 16.8, color: 'rgba(0, 108, 73, 0.8)' },
  { categoria: 'Cartón', porcentaje: 36.6, color: 'rgba(16, 185, 129, 0.8)' },
  { categoria: 'Vidrio', porcentaje: 8.1, color: 'rgba(43, 105, 84, 0.8)' },
  { categoria: 'Orgánico', porcentaje: 38.5, color: 'rgba(0, 108, 75, 0.8)' },
];

export default function Analytics() {
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateCharts(true), 100);
  }, []);

  return (
    <div className="analytics-page content-container">
      {/* Header mejorado */}
      <header className="analytics-header">
        <div className="header-content">
          <div className="header-badge">
            <span className="material-symbols-outlined">insights</span>
            <span>Análisis de Datos ML</span>
          </div>
          <h1 className="analytics-title">Analíticas del Modelo</h1>
          <p className="analytics-subtitle">
            Visualización de patrones históricos del sistema de clasificación 
            automática de residuos mediante Machine Learning
          </p>
        </div>
      </header>

      {/* Métricas destacadas */}
      <section className="key-metrics">
        <div className="metric-card-compact glass-card">
          <div className="metric-icon-wrapper">
            <span className="material-symbols-outlined">dataset</span>
          </div>
          <div className="metric-info">
            <p className="metric-label">Total Muestras</p>
            <h3 className="metric-value">8,179</h3>
            <p className="metric-sublabel">toneladas</p>
          </div>
        </div>

        <div className="metric-card-compact glass-card">
          <div className="metric-icon-wrapper">
            <span className="material-symbols-outlined">speed</span>
          </div>
          <div className="metric-info">
            <p className="metric-label">Precisión</p>
            <h3 className="metric-value">98.4%</h3>
            <p className="metric-sublabel">validación</p>
          </div>
        </div>

        <div className="metric-card-compact glass-card">
          <div className="metric-icon-wrapper">
            <span className="material-symbols-outlined">timeline</span>
          </div>
          <div className="metric-info">
            <p className="metric-label">Período</p>
            <h3 className="metric-value">5 años</h3>
            <p className="metric-sublabel">2021-2025</p>
          </div>
        </div>

        <div className="metric-card-compact glass-card">
          <div className="metric-icon-wrapper">
            <span className="material-symbols-outlined">category</span>
          </div>
          <div className="metric-info">
            <p className="metric-label">Categorías</p>
            <h3 className="metric-value">4</h3>
            <p className="metric-sublabel">tipos</p>
          </div>
        </div>
      </section>

      {/* Contexto */}
      <section className="context-section glass-card">
        <div className="context-icon">
          <span className="material-symbols-outlined">lightbulb</span>
        </div>
        <div className="context-content">
          <h3>Contexto del Problema</h3>
          <p>
            El modelo de Deep Learning clasifica residuos urbanos en cuatro categorías: 
            <strong> Plástico</strong>, <strong>Cartón</strong>, <strong>Vidrio</strong> y 
            <strong> Orgánico</strong>. Los gráficos ilustran el análisis exploratorio realizado 
            durante la Fase 1 en Google Colab.
          </p>
        </div>
      </section>

      {/* Gráfico de líneas */}
      <section className="chart-section glass-card chart-full">
        <div className="chart-header-enhanced">
          <div className="chart-title-group">
            <h3>Tendencia de Residuos por Año</h3>
            <p className="chart-desc">Evolución del volumen por categoría (2021-2025)</p>
          </div>
          <div className="chart-legend-h">
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'rgba(0, 108, 73, 0.9)' }}></span>
              <span>Plástico</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'rgba(16, 185, 129, 0.9)' }}></span>
              <span>Cartón</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'rgba(43, 105, 84, 0.9)' }}></span>
              <span>Vidrio</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ background: 'rgba(0, 108, 75, 0.9)' }}></span>
              <span>Orgánico</span>
            </div>
          </div>
        </div>
        <LineChart data={TREND_DATA} animate={animateCharts} />
      </section>

      {/* Grid 2 columnas */}
      <div className="charts-grid-two">
        <section className="chart-section glass-card">
          <div className="chart-header-enhanced">
            <div className="chart-title-group">
              <h3>Volumen Total por Categoría</h3>
              <p className="chart-desc">Toneladas acumuladas</p>
            </div>
          </div>
          <BarChart data={TOTAL_DATA} animate={animateCharts} />
        </section>

        <section className="chart-section glass-card">
          <div className="chart-header-enhanced">
            <div className="chart-title-group">
              <h3>Composición Porcentual</h3>
              <p className="chart-desc">Distribución relativa</p>
            </div>
          </div>
          <PieChart data={PIE_DATA} animate={animateCharts} />
        </section>
      </div>
    </div>
  );
}

// Componente de gráfico de líneas
function LineChart({ data, animate }) {
  const maxValue = 700;
  const minValue = 100;
  const chartHeight = 300;
  const chartWidth = 100;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };

  const getY = (value) => {
    const range = maxValue - minValue;
    const percentage = ((value - minValue) / range);
    return chartHeight - padding.bottom - (percentage * (chartHeight - padding.top - padding.bottom));
  };

  const getX = (index) => {
    const availableWidth = chartWidth - ((padding.left + padding.right) / 10);
    return (padding.left / 10) + (index / (data.length - 1)) * availableWidth;
  };

  const createPath = (key, color) => {
    let path = '';
    data.forEach((point, index) => {
      const x = getX(index);
      const y = getY(point[key]);
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });
    return { path, color };
  };

  const lines = [
    createPath('plastico', 'rgba(0, 108, 73, 0.9)'),
    createPath('carton', 'rgba(16, 185, 129, 0.9)'),
    createPath('vidrio', 'rgba(43, 105, 84, 0.9)'),
    createPath('organico', 'rgba(0, 108, 75, 0.9)'),
  ];

  return (
    <div className="line-chart">
      <svg viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none">
        {[100, 200, 300, 400, 500, 600, 700].map((value) => (
          <line
            key={value}
            x1={padding.left / 10}
            y1={getY(value)}
            x2={chartWidth - (padding.right / 10)}
            y2={getY(value)}
            stroke="rgba(0, 108, 73, 0.1)"
            strokeWidth="0.2"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {lines.map((line, index) => (
          <path
            key={index}
            d={line.path}
            fill="none"
            stroke={line.color}
            strokeWidth="0.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: animate ? 'none' : '200',
              strokeDashoffset: animate ? '0' : '200',
              transition: 'stroke-dashoffset 2s ease-out',
            }}
          />
        ))}

        {lines.map((line, lineIndex) => (
          data.map((point, pointIndex) => {
            const key = ['plastico', 'carton', 'vidrio', 'organico'][lineIndex];
            return (
              <circle
                key={`${lineIndex}-${pointIndex}`}
                cx={getX(pointIndex)}
                cy={getY(point[key])}
                r="1"
                fill={line.color}
                vectorEffect="non-scaling-stroke"
                style={{
                  opacity: animate ? 1 : 0,
                  transition: `opacity 0.5s ease-out ${pointIndex * 0.1}s`,
                }}
              />
            );
          })
        ))}
      </svg>

      <div className="chart-y-labels">
        {[700, 600, 500, 400, 300, 200, 100].map((value) => (
          <span key={value}>{value}</span>
        ))}
      </div>

      <div className="chart-x-labels">
        {data.map((point) => (
          <span key={point.year}>{point.year}</span>
        ))}
      </div>
    </div>
  );
}

// Componente de gráfico de barras
function BarChart({ data, animate }) {
  const maxValue = Math.max(...Object.values(data));
  const categories = [
    { key: 'plastico', label: 'Plástico', color: 'rgba(0, 108, 73, 0.7)' },
    { key: 'carton', label: 'Cartón', color: 'rgba(16, 185, 129, 0.7)' },
    { key: 'vidrio', label: 'Vidrio', color: 'rgba(43, 105, 84, 0.7)' },
    { key: 'organico', label: 'Orgánico', color: 'rgba(0, 108, 75, 0.7)' },
  ];

  return (
    <div className="bar-chart">
      <div className="bar-chart-grid">
        {[0, 1000, 2000, 3000].map((value) => (
          <div key={value} className="grid-line">
            <span className="grid-label">{value}</span>
          </div>
        ))}
      </div>
      <div className="bar-chart-bars">
        {categories.map((cat, index) => {
          const value = data[cat.key];
          const heightPercent = (value / maxValue) * 100;
          return (
            <div key={cat.key} className="bar-wrapper">
              <div
                className="bar"
                style={{
                  height: animate ? `${heightPercent}%` : '0%',
                  background: cat.color,
                  transitionDelay: `${index * 0.1}s`,
                }}
              >
                <span className="bar-value">{value.toLocaleString()}</span>
              </div>
              <span className="bar-label">{cat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Componente de gráfico circular
function PieChart({ data, animate }) {
  let currentAngle = -90;
  const radius = 40;
  const centerX = 50;
  const centerY = 50;

  const segments = data.map((item) => {
    const startAngle = currentAngle;
    const sweepAngle = (item.porcentaje / 100) * 360;
    currentAngle += sweepAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (currentAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = sweepAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    const labelAngle = startAngle + sweepAngle / 2;
    const labelRad = (labelAngle * Math.PI) / 180;
    const labelDistance = radius * 0.65;
    const labelX = centerX + labelDistance * Math.cos(labelRad);
    const labelY = centerY + labelDistance * Math.sin(labelRad);

    return {
      ...item,
      pathData,
      labelX,
      labelY,
    };
  });

  return (
    <div className="pie-chart">
      <div className="pie-container">
        <svg viewBox="0 0 100 100">
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 1.5}
            fill="none"
            stroke="rgba(0, 0, 0, 0.08)"
            strokeWidth="2"
          />

          {segments.map((segment, index) => (
            <g key={segment.categoria}>
              <path
                d={segment.pathData}
                fill={segment.color}
                stroke="white"
                strokeWidth="0.8"
                style={{
                  opacity: animate ? 0.95 : 0,
                  transition: `opacity 0.6s ease-out ${index * 0.15}s`,
                }}
              />
              <text
                x={segment.labelX}
                y={segment.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="6"
                fontWeight="700"
                style={{
                  opacity: animate ? 1 : 0,
                  transition: `opacity 0.6s ease-out ${0.5 + index * 0.15}s`,
                }}
              >
                {segment.porcentaje}%
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="pie-legend">
        {segments.map((segment, index) => (
          <div
            key={segment.categoria}
            className="pie-legend-item"
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.5s ease-out ${0.8 + index * 0.1}s`,
            }}
          >
            <span
              className="pie-legend-color"
              style={{ background: segment.color }}
            ></span>
            <div className="pie-legend-text">
              <span className="pie-legend-label">{segment.categoria}</span>
              <span className="pie-legend-percent">{segment.porcentaje}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
