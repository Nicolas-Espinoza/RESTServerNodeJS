//funcion para validar que el archivo venga en la request

const { response, request } = require("express");

const validateFile = async (req = request, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {

        return res.status(400).json({
            success: false,
            response: 'No se puede cargar un archivo vacio!'
        })
    }

    next();
}

module.exports = validateFile;
