import React from 'react';
import WastePrediction from '../../components/waste-prediction/WastePrediction';

const WastePredictionPage = () => {
  return (
    <div className="waste-prediction-page">
      <div className="page-header">
        <h1>🤖 IA para Identificación de Residuos</h1>
        <p>Utiliza inteligencia artificial para identificar tipos de residuos y recibir consejos de reciclaje personalizados</p>
      </div>
      
      <WastePrediction />
    </div>
  );
};

export default WastePredictionPage;