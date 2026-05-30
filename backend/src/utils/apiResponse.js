export function success(res, { message = 'Operación exitosa', data = null, statusCode = 200 }) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function error(res, { message = 'Error en la operación', statusCode = 400 }) {
  return res.status(statusCode).json({
    success: false,
    message,
  });
}
