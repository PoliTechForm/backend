import nodemailer from 'nodemailer'


export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ortegamarcelodavid77@gmail.com', // AQUI DEBES PONER TU CORREO ELECTRÓNICO
    pass: '', // AQUÍ DEBES POENR LA CLAVE DE APLICACIÓN DE TU CORREO, NO ES TU CONTRASEÑA, PARA OBTENERLO TE VAS A LAS CONFIGURACIONESS DE TU CUENTA DE GOOGLE Y BUSCAS CLAVE DE APLICACION, LO COPIAS Y LO PEGAS SIN ESPACIOS
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
    from: 'spotlight050324@gmail.com',
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

