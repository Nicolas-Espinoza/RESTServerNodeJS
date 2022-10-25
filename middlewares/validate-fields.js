const { validationResult } = require("express-validator");

//este codigo en realidad se debia hacer en el controlador
//preguntar si hay errores que haga el retorno correspondiente,
//pero para no copiar y pegar lo convertimos en middlware
const validateFields = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            response: errors
        })
    }

    next();
}

module.exports = validateFields;