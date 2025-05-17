import nodemailer from 'nodemailer'
import { EMAIL_ENTERPRISE, PASSWORD_APP } from '../env/env.js';


export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_ENTERPRISE,
    pass: PASSWORD_APP,
  },
  tls: {
    rejectUnauthorized: false, // Esto evita el error de certificado
  },
});

const sendVerificationEmail = async (email) => {
  // El token será el correo electrónico del usuario
  const verificationUrl = `http://localhost:4000/api/verify?token=${encodeURIComponent(email)}`;

  // Configurar el contenido del correo
  const mailOptions = {
    from: EMAIL_ENTERPRISE,
    to: email,
    subject: 'Verificación de Correo Electrónico',
    html: `<p>Haz clic en el siguiente enlace para verificar tu correo electrónico:</p>
           <a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Error al enviar el correo:', err.message);
    throw new Error('No se pudo enviar el correo de verificación');
  }
};

export default sendVerificationEmail

