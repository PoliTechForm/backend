// Futuro validar Jwt solo falta adaptarlo a nuestra DB

// import jwt from 'jsonwebtoken';
// import { pool } from '../../dataBase/db.js'; // asegurate que `pool` esté configurado

// export const validarJwt = async (req, res, next) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) {
//             return res.status(401).json('No se encontró el token');
//         }

//         const decoded = jwt.verify(token, 'adnnvjwjhjngvkksñkmvjnnq');

//         const query = 'SELECT * FROM users WHERE id = $1';
//         const values = [decoded.userId];

//         const result = await pool.query(query, values);

//         if (result.rows.length === 0) {
//             return res.status(401).json('Token inválido');
//         }

//         req.user = result.rows[0];
//         next();
//     } catch (error) {
//         return res.status(500).json({
//             message: 'Error en el servidor',
//         });
//     }
// };
