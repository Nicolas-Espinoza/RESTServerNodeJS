const { Router } = require('express');
const { check } = require('express-validator');
const { loguearUsuario, loguearUsuarioGoogle } = require('../controllers/auth.controller');
const validateFields = require('../middlewares/validate-fields');

const router = Router();

router.post('/login', [
    check('mail', 'no es un mail de formato valido!').isEmail(),
    check('mail', 'El mail es obligatorio!').notEmpty(),
    check('password', 'el password es obligatorio!').notEmpty(),
    validateFields
], loguearUsuario);

router.post('/google', [
    check('id_token', 'id token es necesario').notEmpty(),
    validateFields
], loguearUsuarioGoogle);

module.exports = router;