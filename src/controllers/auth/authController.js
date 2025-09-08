import { registerUserService, userVerifyEmail, loginUserService, userVerifyTwoFactorService, changeUserPasswordService, resetPasswordService } from '../../services/user.Auth.Service.js';
import { generateAndSend2FACode } from '../../services/2FA/twoFactors.service.js';
import { login_metrics } from '../../services/recolectarMetricas/collectMetrics.Service.js';
import pool from '../../dataBase/pool.js';
import bcrypt from 'bcrypt';


export const registerUser = async (req, res) => {
  const { nombre, dni, email, password, role = 'ciudadano', recaptchaToken } = req.body;
  console.log('DNI recibido en backend:', dni, typeof dni);

  try {
    await registerUserService(nombre, dni, email, password, role, recaptchaToken);
    res.status(201).json({
      message: 'Usuario registrado con éxito. Revisa tu correo para verificar tu cuenta.'
    });
  } catch (err) {
    console.error('Registration error:', err);
    console.log('Registration error details:', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    await userVerifyEmail(token);
    res.json({ message: 'Correo verificado exitosamente' });
  } catch (err) {
    console.error('Error en la verificación de correo:', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
};

export const loginUser = async (req, res) => {
  const platform = req.headers['x-platform'] || 'web';

  try {
    const { email, password } = req.body;
    const dataLogin = await loginUserService(email, password);

    if (dataLogin.twoFactorRequired) {
      // Validar que userId existe
      if (!dataLogin.userId) {
        return res.status(500).json({
          error: 'Error del servidor: userId no generado para 2FA',
        });
      }
      await generateAndSend2FACode(dataLogin.email, dataLogin.userId);

      return res.status(200).json({
        message: 'Se requiere código 2FA',
        twoFactorRequired: true,
        userId: dataLogin.userId,
      });
    }
    // ... resto del código

    console.log('dataLogin en loginUser:', dataLogin);

    //Recolecta métricas de inicios de sesión
    await login_metrics(dataLogin.userWithoutPassword.id, platform, true);

    const responseData = {
      message: 'Inicio de sesión exitoso',
      user: dataLogin.userWithoutPassword,
      token: dataLogin.token
    };

    if (platform === 'web') {
      res.cookie("token", dataLogin.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
      });
    }

    res.json(responseData);

  } catch (err) {
    await login_metrics(null, platform, false);
    console.error('Error en el inicio de sesión:', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
};

export const getSession = (req, res) => {
  try {
    const user = req.user
    return res.status(200).json({ msg: "Te haz autenticado", User: user });
  } catch (error) {
    return res.status(500).json({ msg: "Hubo un error inesperado." });
  }
};

export const logoutUser = (req, res) => {
  try {
    // Plataforma del cliente
    const platform = req.headers['x-platform'] || 'web';

    // Para web, nv la cookie
    if (platform === 'web') {
      res.clearCookie("token");
    }

    // Para ambas plataformas, enviamos confirmación
    res.status(200).json({ msg: "Cierre de sesión exitoso" })
  } catch (error) {
    res.status(400).json("Hubo un error inesperado.")
  }
};

export const verify2FACode = async (req, res) => {
  try {
    const { userId, code } = req.body;
    // Plataforma del cliente
    const platform = req.headers['x-platform'] || 'web';

    const token = await userVerifyTwoFactorService(userId, code);

    // Respuesta para ambas plataformas
    const responseData = {
      message: '2FA verificado, inicio de sesión exitoso',
      token: token // Incluir el token para clientes móviles
    };

    // Para web, también establecemos la cookie
    if (platform === 'web') {
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000,
      });
    }

    res.json(responseData);

  } catch (err) {
    console.error('Error al verificar 2FA:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;
    await changeUserPasswordService(userId, currentPassword, newPassword)

    res.json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);

    // Con esto brindaremos la respuesta a los errores del servicio
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'La contraseña actual es incorrecta') {
      return res.status(401).json({ error: error.message });
    }
    if (error.message === 'Se requieren ambas contraseñas') {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Error del servidor' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Se requiere el email' });
    }
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const userId = userRes.rows[0].id;
    await generateAndSend2FACode(email, userId);
    res.status(200).json({ message: 'Código enviado al correo electrónico' });
  } catch (err) {
    console.error('Error al solicitar código de recuperación:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    await resetPasswordService(email, code, newPassword);

    res.status(200).json({ message: 'Contraseña restablecida correctamente' });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Error del servidor' });
  }
};

export const enableOrDisableTwoFactor = async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;

    if (!user) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Contraseña requerida' });
    }

    // Obtener contraseña actual desde DB
    const result = await pool.query(
      'SELECT password_hash, two_factor_enabled FROM users WHERE id = $1',
      [user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const dbUser = result.rows[0];

    const isMatch = await bcrypt.compare(password, dbUser.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const newStatus = !dbUser.two_factor_enabled;

    await pool.query(
      'UPDATE users SET two_factor_enabled = $1 WHERE id = $2',
      [newStatus, user.id]
    );

    const message = newStatus ? '2FA activado correctamente' : '2FA desactivado correctamente';
    res.status(200).json({ message });

  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Actualizar perfil del usuario autenticado
// Actualizar perfil del usuario autenticado
// Actualizar perfil del usuario autenticado
export const updateProfile = async (req, res) => {
  console.log('updateProfile body:', req.body);
  console.log('updateProfile user:', req.user);

  try {
    const userId = req.user?.id;
    const { nombre, sexo, dni, location_id } = req.body; // Ahora recibimos directamente el ID de la ubicación

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    // Validar que al menos un campo venga
    if (!nombre && !sexo && !dni && !location_id) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    const updates = [];
    const values = [];
    let count = 1;

    if (nombre) {
      updates.push(`nombre = $${count++}`);
      values.push(nombre);
    }
    if (sexo) {
      updates.push(`sexo = $${count++}`);
      values.push(sexo);
    }
    if (dni) {
      updates.push(`dni = $${count++}`);
      values.push(dni);
    }
    if (location_id) {
      // Verificar que la ubicación exista en locations
      const checkLoc = await pool.query(
        'SELECT id FROM locations WHERE id = $1',
        [location_id]
      );
      if (checkLoc.rows.length === 0) {
        return res.status(400).json({ error: 'La ubicación seleccionada no existe' });
      }

      updates.push(`location_id = $${count++}`);
      values.push(location_id);
    }

    values.push(userId);

    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${count}
      RETURNING id, nombre, sexo, dni, email, location_id
    `;
    console.log('Executing query:', query);
    console.log('With values:', values);

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const query = `
      SELECT u.id, u.nombre, u.sexo, u.dni, u.email, u.location_id, l.localidad
      FROM users u
      LEFT JOIN locations l ON u.location_id = l.id
      WHERE u.id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ user: result.rows[0] });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};




// Obtener ubicaciones disponibles en la base de datos
export const getUbicaciones = async (req, res) => {
  try {
    const query = `
      SELECT id, localidad, departamento, provincia 
      FROM locations 
      ORDER BY provincia ASC, departamento ASC, localidad ASC
    `;
    
    const result = await pool.query(query);
    
    // Formatear las ubicaciones para mostrar: "localidad, departamento, provincia"
    const ubicaciones = result.rows.map(row => ({
      id: row.id,
      display: `${row.localidad}, ${row.departamento}, ${row.provincia}`,
      localidad: row.localidad,
      departamento: row.departamento,
      provincia: row.provincia
    }));
    
    return res.status(200).json({ ubicaciones });
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
};


