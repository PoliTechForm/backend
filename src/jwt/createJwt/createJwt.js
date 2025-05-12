
import jwt from 'jsonwebtoken';

export const createJwt = (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const payLoad = { userId };

            jwt.sign(payLoad, 'adnnvjwjhjngvkksñkmvjnnq', {
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