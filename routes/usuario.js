import { Router } from "express";
import httpUsuario from "../controllers/usuario.js";
import { check } from "express-validator";
import validarCampos from "../middlewares/validar.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import helpersUsuario from "../helpers/usuario.js";

const router = new Router();

//Get
router.get("/all", [validarJWT], httpUsuario.getAll);

router.get(
  "/codigo-recuperar/:correo",
  [
    check("correo", "Por favor ingrese el correo").not().isEmpty(),
    check("correo").custom(helpersUsuario.existeCorreo),
    validarCampos,
  ],
  httpUsuario.codigoRecuperar
);

router.get(
  "/confirmar-codigo/:codigo",
  [check("codigo", "Ingrese el código").not().isEmpty(), validarCampos],
  httpUsuario.confirmarCodigo
);

//Post
router.post(
  "/registro",
  [
    check("nombre", "Digite el nombre").not().isEmpty(),
    check("identificacion", "Digite la identificacion").not().isEmpty(),
    check("identificacion").custom(helpersUsuario.existeIdentificacion),
    check("correo", "Digite el correo").not().isEmpty(),
    check("correo", "Dirección de correo no válida").isEmail(),
    check("correo").custom(helpersUsuario.existeCorreo),
    check("telefono", "Digite el telefono").not().isEmpty(),
    check("telefono").custom(helpersUsuario.existeTelefono),
    check(
      "password",
      "La contraseña debe contener al menos 1 mayúscula, 1 minúscula, al menos 2 números y un carácter especial"
    ).custom(helpersUsuario.validarPassword),
    validarCampos,
  ],
  httpUsuario.registroUsuario
);

router.post(
  "/login",
  [
    check("identificacion", "Digite su identificacion").not().isEmpty(),
    check("password", "Digite la contraseña").not().isEmpty(),
  ],
  httpUsuario.login
);

router.put(
  "/nueva-password",
  [
    check("correo", "Por favor ingrese el correo").not().isEmpty(),
    check("correo").custom(helpersUsuario.existeCorreoNewPass),
    check("codigo", "Ingrese el código").not().isEmpty(),
    check("password", "Ingrese la password").not().isEmpty(),
    check("password").custom(helpersUsuario.validarPassword),
    validarCampos,
  ],
  httpUsuario.nuevaPassword
);

router.put(
  "/editar/:id",
  [
    validarJWT,
    check("id", "Ingrese una id").not().isEmpty(),
    check("id", "Id no válida").isMongoId(),
    check("id").custom(helpersUsuario.existeHolderById),
    check("nombre", "Digite el nombre").not().isEmpty(),
    check("identificacion", "Digite la identificacion").not().isEmpty(),
    check("identificacion").custom(helpersUsuario.existeIdentificacion),
    check("correo", "Digite el correo").not().isEmpty(),
    check("correo", "Dirección de correo no válida").isEmail(),
    check("correo").custom(helpersUsuario.existeCorreo),
    check("telefono").custom(helpersUsuario.existeTelefono),
    check("telefono", "Digite el telefono").not().isEmpty(),
    validarCampos,
  ],
  httpUsuario.editarUsuario
);

router.put(
  "/inactivar/:id",
  [
    validarJWT,
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("id").custom(helpersUsuario.existeHolderById),
    validarCampos,
  ],
  httpUsuario.putInactivar
);
router.put(
  "/activar/:id",
  [
    validarJWT,
    check("id", "Ingrese un ID válido").not().isEmpty(),
    check("id", "Ingrese un ID válido").isMongoId(),
    check("id").custom(helpersUsuario.existeHolderById),
    validarCampos,
  ],
  httpUsuario.putActivar
);

export default router;
