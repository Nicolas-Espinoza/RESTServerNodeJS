const userModel = require('../models/user.model');

const { response } = require('express')

const { ObjectId } = require('mongoose').Types;

const collectionAllowed = [
    'users',
    'categories',
    'products',
    'roles'
]

const buscarUsuario = async (term, res = response) => {

    const mongoId = ObjectId.isValid(term);

    if (mongoId) {

        const usuario = await userModel.findById(term);

        return usuario;
    }
}

const searchController = async (req, res = response) => {

    const { collection, term } = req.params;

    if (!collectionAllowed.includes(collection)) {

        return res.status(400).json({
            success: false,
            response: `Coleccion no valida! intente: ${collectionAllowed}`
        })

    }

    switch (collection) {
        case 'users':
            const user = await buscarUsuario(term, req)
            res.status(200).json({
                success: true,
                response: user
            })
            break;
        case 'categories':

            break;
        case 'products':

            break;

        default:
            res.status(500).json({
                success: false,
                response: `Busqueda no programada!`
            })
    }
}


module.exports = searchController