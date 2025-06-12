import pool from "../../dataBase/pool.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import sendVerificationEmail from "../../services/verify.Email.Service.js";

export const createUser = async(req, res) => {
    const user = req.user;
    const { nombre, email, password, role = 'ciudadano' } = req.body;
     console.log(nombre, email);
     try {
        const result = await pool.query(` SELECT r.nombre FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`, [user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({msg: 'Usuario no encontrado'});
        }
        
        if (result.rows[0].nombre !== 'administrador' && result.rows[0].nombre !== 'Empleado') {
            return res.status(403).json({msg: 'No tienes acceso a esa función'});
        }

       const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
       if (userExists.rows.length > 0) {
           return res.status(501).json({msg:'El correo ya está registrado'});
       }

       const roleResult = await pool.query('SELECT id FROM roles WHERE nombre = $1', [role]);
       if (roleResult.rows.length === 0) {
           return res.status(501).json({msg:'Rol inválido'});
       }

       const roleId = roleResult.rows[0].id;

       const salt = await bcrypt.genSalt(10);
       const passwordHash = await bcrypt.hash(password, salt);

       const userId = uuidv4();
       await pool.query( `INSERT INTO users (id, nombre, email, password_hash, role_id, verificado_email)
       VALUES ($1, $2, $3, $4, $5, false)`, [userId, nombre, email, passwordHash, roleId]);

       await sendVerificationEmail(email);
       res.status(201).json({
         message: 'Usuario creado con éxito.'
       });
     } catch (err) {
       console.error('Error en el registro:', err.message);
       res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
     }
}

export const getEmployeesAndCitizens = async (_req, res) => {
    try {
      const result = await pool.query(`
        SELECT u.*, r.nombre AS rol
        FROM users u
        JOIN roles r ON u.role_id = r.id
        WHERE r.nombre IN ('ciudadano', 'Empleado')
      `);
  
      return res.status(200).json(result.rows);
  
    } catch (err) {
      console.error('Error al obtener usuarios:', err.message);
      res.status(500).json({ error: 'Error del servidor' });
    }
  };