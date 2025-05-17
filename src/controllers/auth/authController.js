import { registerUserService, userVerifyEmail, loginUserService } from '../../services/user.Auth.Service.js';

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
    console.log(email, password);
    const { token, userWithoutPassword } = await loginUserService(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000
    });

    res.json({ message: 'Inicio de sesión exitoso', user: userWithoutPassword });
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

export const logoutUser = (_req, res) => {
try {
    res.clearCookie("token")
    res.status(200).json({msg: "Cierre de sessión exitoso"})
} catch (error) {
    res.status(400).json("Hubo un error inesperado.")
}}
