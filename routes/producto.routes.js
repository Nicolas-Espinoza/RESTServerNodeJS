const { Router } = require('express');
const { check } = require('express-validator');
const {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    desactivarProducto,
    eliminarProducto
} = require('../controllers/products.controller');

const { categoryExistInDB, productExistInDB } = require('../helpers/db-validator');
const validateFields = require('../middlewares/validate-fields');
const validateJWT = require('../middlewares/validate-jwt');
const { validateAdminRole } = require('../middlewares/validate-roles');

const router = Router()

//obtener todos los productos

router.get('/', obtenerProductos);

//crear producto - cualquier usuario con token
router.post('/', [
    validateJWT,
    check('name', 'El nombre es requerido!').notEmpty(),
    check('name', 'No cumple con los parametros requeridos').isString(),
    check('price').isNumeric(),
    check('category', 'No es un ID de mongo valido!').isMongoId(),
    check('category').custom(categoryExistInDB),
    check('description', 'la descripcion es requerida!').notEmpty(),
    validateFields
], crearProducto);

//obtener productos - publico

router.get('/', obtenerProductos);

//obtener producto - publico
router.get('/:id', [
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('id').custom(productExistInDB),
    validateFields
], obtenerProducto);

//actualizar producto - cualquier usuario con token
//name - price - category - description - isAvailable
router.patch('/:id', [
    validateJWT,
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('id').custom(productExistInDB),
    check('name', 'el nombre es requerido!').notEmpty(),
    check('price', 'debe ser un numero!').isNumeric().optional(),
    check('description').isString().optional(),
    check('category', 'No es un ID de mongo valido!').isMongoId().optional(),
    check('category').custom(categoryExistInDB),
    check('isAvailable', 'debe ser un boolean!').isBoolean().optional(),
    validateFields
], actualizarProducto);

//desactivar producto - admin

router.put('/:id', [
    validateJWT,
    validateAdminRole,
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('id').custom(productExistInDB),
    check('status', 'el status es requerido!').notEmpty(),
    check('status', 'Debe ser un boolean!').isBoolean(),
    validateFields
], desactivarProducto);

//eliminar producto - admin
router.delete('/:id', [
    validateJWT,
    validateAdminRole,
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('id').custom(productExistInDB),
    validateFields
], eliminarProducto);


module.exports = router;