const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

//recordar que los middleware comparten la misma req y res

const validateJWT = async (req, res, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            success: false,
            response: 'No hay token en la peticion!'
        })
    }

    try {

        //extraigo el uid del user, es el payload de mi token
        //jwt.verify me devuelve el payload de mi token
        const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);

        //busco el usuario en la base de datos
        const userLogged = await User.findById(uid);

        //usuario no existe
        if (!userLogged) {
            return res.status(401).json({
                success: false,
                response: 'Token no valido! - usuario no existente!'
            })
        }
        //validar el status
        if (!userLogged.status) {

            return res.status(401).json({
                success: false,
                response: 'Token no valido! - status false!'
            })

        }


        //en el objeto req agrego el campo user
        //que contiene al usuario logueado
        req.user = userLogged;
        next();

    } catch (error) {

        console.log(error)
        res.status(401).json({
            success: false,
            response: 'Token no valido!'
        })

    }

}

module.exports = validateJWT;