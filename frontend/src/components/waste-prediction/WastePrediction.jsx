import React, { useState, useRef, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import './waste-prediction.css';

const WastePrediction = () => {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // URLs del modelo de Teachable Machine
  const MODEL_URL = '/models/model.json';
  const METADATA_URL = '/models/metadata.json';

  useEffect(() => {
    loadModel();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const loadModel = async () => {
    try {
      setIsModelLoading(true);
      const loadedModel = await tmImage.load(MODEL_URL, METADATA_URL);
      setModel(loadedModel);
      setIsModelLoading(false);
    } catch (error) {
      console.error('Error loading model:', error);
      setIsModelLoading(false);
      alert('Error cargando el modelo de predicción. Por favor, verifica que los archivos del modelo estén disponibles.');
    }
  };

  const predict = async (imageElement) => {
    if (!model) return;

    setIsLoading(true);
    try {
      const prediction = await model.predict(imageElement);
      const sortedPredictions = prediction
        .map((pred, index) => ({
          className: pred.className,
          probability: pred.probability,
          index
        }))
        .sort((a, b) => b.probability - a.probability);
      
      setPredictions(sortedPredictions);
    } catch (error) {
      console.error('Error making prediction:', error);
      alert('Error al realizar la predicción');
    }
    setIsLoading(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setSelectedImage(e.target.result);
          predict(img);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Usar cámara trasera en móviles
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('No se pudo acceder a la cámara');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    setSelectedImage(imageData);
    
    // Crear elemento imagen para predicción
    const img = new Image();
    img.onload = () => predict(img);
    img.src = imageData;
    
    stopCamera();
  };

  const getRecyclingAdvice = (topPrediction) => {
    const advice = {
      'Plástico': {
        type: 'Plástico',
        color: '#3B82F6',
        tips: [
          'Lava el envase antes de reciclarlo',
          'Retira etiquetas y tapas si es posible',
          'Deposítalo en el contenedor amarillo'
        ],
        icon: '♻️'
      },
      'Cartón': {
        type: 'Cartón',
        color: '#8B5CF6',
        tips: [
          'Mantén el cartón seco y limpio',
          'Retira cintas adhesivas y grapas',
          'Aplana las cajas para ahorrar espacio',
          'Deposítalo en el contenedor azul'
        ],
        icon: '📦'
      },
      'Vidrio': {
        type: 'Vidrio',
        color: '#10B981',
        tips: [
          'Retira tapas y etiquetas metálicas',
          'No mezcles con cristal o cerámica',
          'Deposítalo en el contenedor verde'
        ],
        icon: '🍾'
      },
      'Orgánico': {
        type: 'Orgánico',
        color: '#F59E0B',
        tips: [
          'Puede ir al compostaje doméstico',
          'Deposítalo en el contenedor marrón',
          'Evita mezclar con otros residuos'
        ],
        icon: '🌱'
      }
    };

    return advice[topPrediction?.className] || {
      type: 'No clasificado',
      color: '#6B7280',
      tips: ['Consulta las normas locales de reciclaje'],
      icon: '❓'
    };
  };

  if (isModelLoading) {
    return (
      <div className="waste-prediction-loading">
        <div className="loading-spinner"></div>
        <p>Cargando modelo de predicción...</p>
      </div>
    );
  }

  const topPrediction = predictions[0];
  const advice = topPrediction ? getRecyclingAdvice(topPrediction) : null;

  return (
    <div className="waste-prediction-container">
      <div className="prediction-header">
        <h2>🔍 Identificador de Residuos</h2>
        <p>Sube una foto o usa tu cámara para identificar el tipo de residuo y obtener consejos de reciclaje</p>
      </div>

      <div className="prediction-controls">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="control-btn upload-btn"
          disabled={isLoading}
        >
          📸 Subir Imagen
        </button>
        
        {!cameraActive ? (
          <button 
            onClick={startCamera}
            className="control-btn camera-btn"
            disabled={isLoading}
          >
            📷 Usar Cámara
          </button>
        ) : (
          <div className="camera-controls">
            <button onClick={capturePhoto} className="control-btn capture-btn">
              📸 Capturar
            </button>
            <button onClick={stopCamera} className="control-btn stop-btn">
              ❌ Detener
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {cameraActive && (
        <div className="camera-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-video"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {selectedImage && !cameraActive && (
        <div className="image-preview">
          <img src={selectedImage} alt="Imagen seleccionada" />
        </div>
      )}

      {isLoading && (
        <div className="prediction-loading">
          <div className="loading-spinner"></div>
          <p>Analizando imagen...</p>
        </div>
      )}

      {predictions.length > 0 && !isLoading && (
        <div className="prediction-results">
          <div className="main-result" style={{ borderColor: advice?.color }}>
            <div className="result-header">
              <span className="result-icon">{advice?.icon}</span>
              <h3>{advice?.type}</h3>
              <span className="confidence">
                {(topPrediction.probability * 100).toFixed(1)}% de confianza
              </span>
            </div>
            
            <div className="recycling-tips">
              <h4>💡 Consejos de reciclaje:</h4>
              <ul>
                {advice?.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="all-predictions">
            <h4>Todas las predicciones:</h4>
            {predictions.map((prediction, index) => (
              <div key={index} className="prediction-item">
                <span className="prediction-name">{prediction.className}</span>
                <div className="prediction-bar">
                  <div 
                    className="prediction-fill" 
                    style={{ 
                      width: `${prediction.probability * 100}%`,
                      backgroundColor: index === 0 ? advice?.color : '#e5e7eb'
                    }}
                  />
                </div>
                <span className="prediction-percentage">
                  {(prediction.probability * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WastePrediction;