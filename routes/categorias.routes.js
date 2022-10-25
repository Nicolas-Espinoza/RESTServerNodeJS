const { Router } = require('express');
const { check } = require('express-validator');

const {
    crearCategoria,
    editarCategoria,
    eliminarCategoria,
    desactivarCategoria,
    obtenerCategorias,
    obtenerUnaCategoria
} = require('../controllers/categorias.controller');

const validateFields = require('../middlewares/validate-fields');
const validateJWT = require('../middlewares/validate-jwt');
const { categoryNameExist, categoryExistInDB } = require('../helpers/db-validator');
const { validateAdminRole } = require('../middlewares/validate-roles');



const router = Router();

//obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//obtener una categoria
router.get('/:id', [
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('id').custom(categoryExistInDB),
    validateFields
], obtenerUnaCategoria);

//crear categoria - privado - cualquier rol con token valido
router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio!').notEmpty(),
    check('name').custom(categoryNameExist),
    validateFields
], crearCategoria)

//actualizar categoria por id - privado - cualquier rol con token
router.patch('/:id', [
    validateJWT,
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('id').custom(categoryExistInDB),
    check('name', 'El nombre es obligatorio!').notEmpty(),
    check('name').custom(categoryNameExist),
    validateFields
], editarCategoria)

//cambiar categoria activo a inactivo - admin
router.put('/desactivar/:id', [
    validateJWT,
    validateAdminRole,
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('id').custom(categoryExistInDB),
    check('status', 'enviar status es necesario!').notEmpty(),
    check('status', 'Debe ser un boolean!').isBoolean(),
    validateFields
], desactivarCategoria);

//eliminar fisicamente una categoria - admin
router.delete('/:id', [
    validateJWT,
    validateAdminRole,
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('id').custom(categoryExistInDB),
    validateFields
], eliminarCategoria);


module.exports = router;