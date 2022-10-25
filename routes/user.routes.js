const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearUsuario,
    modificarUsuario,
    obtenerUsuariosPaginado,
    desactivarUsuario
} = require('../controllers/user.controller');

//podemos hacer la optimizacion en un archivo index en la carpeta de middlewares
//exportar un objeto con su spred operator

const validateFields = require('../middlewares/validate-fields');
const validateJWT = require('../middlewares/validate-jwt');
const { validateAdminRole, haveRole } = require('../middlewares/validate-roles');

const { validateRole, validateEmailExist, userExist } = require('../helpers/db-validator');



const router = Router();

//check('campo a revisar' , 'msg de error')
//recordemos que si no agregamos el validateFields se cuelga el backend
//ya que en esa funcion estamos diciendo si el req viene con errores, que devuelva el error
router.post('/',
    [
        check('mail', 'No es un correo valido!').isEmail(),
        check('name', 'El nombre es requerido!').notEmpty(),
        check('password', 'Minimo 6 caracteres!').isLength({ min: 6 }),
        //check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('role').custom(validateRole),
        check('mail').custom(validateEmailExist),
        validateFields
    ],
    crearUsuario
);

router.put('/:id', [
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('id').custom(userExist),
    check('role').custom(validateRole),
    validateFields
], modificarUsuario);

router.delete('/:id', [
    validateJWT,
    //validateAdminRole,
    haveRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID valido!').isMongoId(),
    check('id').custom(userExist)
], desactivarUsuario);


router.get('/', obtenerUsuariosPaginado);

module.exports = router;