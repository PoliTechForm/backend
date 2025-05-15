
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../env/env.js';

export const createJwt = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const payLoad = { userId };

            jwt.sign(payLoad, SECRET_KEY, {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) {
                    reject('No se pudo generar el token');
                } else {
                    resolve(token);
                }
            });
        } catch (error) {
            console.log(error);
        }
    });
};