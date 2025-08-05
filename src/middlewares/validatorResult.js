import { validationResult } from "express-validator";

export const validationError = (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        console.error('Errores de validación:', errores.array());
        return res.status(400).json({ error: errores.array()[0].msg });
    }
    next();
};