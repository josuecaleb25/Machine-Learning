-- Puntos de reciclaje de ejemplo — Lima Metropolitana
-- Ejecutar en Supabase SQL Editor después de crear la tabla puntos_reciclaje

INSERT INTO puntos_reciclaje (nombre, direccion, latitud, longitud, tipos_residuos, horario, activo)
VALUES
  ('Punto Ecológico Miraflores', 'Av. Larco 345, Miraflores', -12.12650000, -77.03080000, 'Plástico, Vidrio, Papel, Cartón, Metal', 'Lun-Dom 08:00-20:00', true),
  ('Estación Recicla San Isidro', 'Av. Tomás Marsano 2500, San Isidro', -12.09820000, -77.01150000, 'Plástico PET, Vidrio, Tetrapak, Orgánico', '24 horas', true),
  ('Centro de Acopio La Punta', 'Av. Venezuela 1050, La Punta', -12.06800000, -77.10200000, 'Plástico, Cartón, Metal, Electrónicos RAEE', 'Lun-Sáb 09:00-18:00', true),
  ('EcoPunto Barranco', 'Jr. Unión 480, Barranco', -12.14200000, -77.02100000, 'Vidrio, Plástico, Papel', 'Mar-Dom 10:00-19:00', true),
  ('Recicladora Surco Verde', 'Av. Primavera 1200, Santiago de Surco', -12.13500000, -76.99800000, 'Plástico, Metal, Cartón, Orgánico', 'Lun-Vie 07:00-17:00', true),
  ('Punto Limpio Jesús María', 'Av. Arenales 1850, Jesús María', -12.07500000, -77.04500000, 'Plástico, Vidrio, Electrónicos, Pilas', 'Lun-Sáb 08:00-16:00', true),
  ('Estación Verde Magdalena', 'Av. Javier Prado 3200, Magdalena', -12.09000000, -77.07000000, 'Papel, Cartón, Plástico', 'Lun-Dom 09:00-21:00', true),
  ('Acopio Rimac Centro', 'Av. Nicolás de Piérola 500, Rímac', -12.02800000, -77.02500000, 'Metal, Vidrio, Plástico', 'Lun-Vie 08:00-15:00', true),
  ('Punto Ecológico Los Olivos', 'Av. Alfredo Mendiola 4500, Los Olivos', -11.99000000, -77.07000000, 'Plástico, Cartón, Orgánico', 'Sáb-Dom 09:00-14:00', true),
  ('Reciclaje Callao Puerto', 'Av. Oscar Benavides 800, Callao', -12.05200000, -77.13800000, 'Vidrio, Metal, Electrónicos', 'Lun-Sáb 10:00-18:00', true)
;
