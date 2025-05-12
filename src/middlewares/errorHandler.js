const errorHandler = (err, req, res, next) => {
  if (err.errors) {
    return res.status(400).json({
      message: 'Error de validación',
      errors: err.errors,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Acceso no autorizado',
      error: err.message,
    });
  }

  if (err.message) {
    return res.status(500).json({
      message: 'Algo salió mal',
      error: err.message,
    });
  }

  return res.status(500).json({
    message: 'Error desconocido',
    error: err,
  });
};

export default errorHandler;
