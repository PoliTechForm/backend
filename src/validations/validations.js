import { body } from "express-validator";

const sqlInjectionPattern = /(\b(SELECT|UPDATE|DELETE|INSERT|DROP|ALTER|--|;|'|")\b)/i;

export const validarRegistro = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre de usuario no debe estar vacío")
    .matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ0-9]+$/)
    .withMessage("El nombre contiene caracteres no permitidos"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo electrónico válido"),

  body("password")
  .trim()
  .notEmpty()
  .withMessage("La contraseña no puede estar vacía")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
  .withMessage({msg: "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos"})
  .custom((value) => {
    if (sqlInjectionPattern.test(value)) {
      throw new Error("La contraseña contiene patrones inválidos");
    }
    return true;
  }),
body("recaptchaToken")
  .notEmpty()
  .withMessage("El token de reCAPTCHA es obligatorio"),
];


export const validarLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo válido"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .custom((value) => {
      if (sqlInjectionPattern.test(value)) {
        throw new Error("La contraseña contiene patrones inválidos");
      }
      return true;
    }),
];