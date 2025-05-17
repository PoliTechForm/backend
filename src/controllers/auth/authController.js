import { registerUserService, userVerifyEmail, loginUserService, userVerifyTwoFactorService, changeUserPasswordService } from '../../services/user.Auth.Service.js';
import { generateAndSend2FACode } from '../../services/2FA/twoFactors.service.js';

export const registerUser = async (req, res) => {
  const { nombre, email, password, role = 'ciudadano', captchaToken } = req.body;

  try {
    await registerUserService(nombre, email, password, role, captchaToken);
    res.status(201).json({
      message: 'Usuario registrado con éxito. Revisa tu correo para verificar tu cuenta.'
    });
  } catch (err) {
    console.error('Error en el registro:', err.message);
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
  try {
    const { email, password } = req.body;
    const platform = req.headers['x-platform'] || 'web';
    const dataLogin = await loginUserService(email, password);

    if (dataLogin.twoFactorRequired) {
      await generateAndSend2FACode(dataLogin.email, dataLogin.userId);

      return res.status(200).json({
        message: 'Se requiere código 2FA',
        twoFactorRequired: true,
        userId: dataLogin.userId,
      });
    }

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
    console.error('Error en el inicio de sesión:', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Error del servidor' });
  }
};

export const getSession = (req, res) => {
  try {
    const user = req.user
    return res.status(200).json({msg:"Te haz autenticado", User: user});
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
    res.status(200).json({msg: "Cierre de sesión exitoso"})
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