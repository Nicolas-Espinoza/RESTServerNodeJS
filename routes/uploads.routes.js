const { Router } = require('express');
const { check } = require('express-validator');

const validateFields = require('../middlewares/validate-fields')
const { cargarArchivo, obtenerArchivo, editarArchivoCloudinary } = require('../controllers/uploads.controller');
const validateCollections = require('../helpers/validateCollections');
const validateFile = require('../middlewares/validate-file');


const router = Router();

//crear nuevo recurso - subida de archivo - ejemplo - no es necesario!
router.post('/', [validateFile], cargarArchivo);

//actualizar es la unica que necesito y la de obtener
router.put('/:collection/:id', [
    validateFile,
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('collection').custom(validateCollections),
    validateFields
], editarArchivoCloudinary);


router.get('/:collection/:id', [
    check('id', 'No es un ID de mongo valido!').isMongoId(),
    check('collection').custom(validateCollections),
    validateFields
], obtenerArchivo)

module.exports = router;