const User = require('../models/user.model');
const bcript = require('bcryptjs');

const userController = {

    crearUsuario: async (req, res) => {

        //extraigo mis datos del body
        const { name, mail, password, role } = req.body;

        //crear el usuario
        const user = new User({
            name, mail, password, role
        });

        //encriptar password
        const salt = bcript.genSaltSync();
        user.password = bcript.hashSync(password, salt);

        //guardar en base de datos
        await user.save();

        //enviar la respuesta
        res.json({
            success: true,
            response: user
        })
    },

    modificarUsuario: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(id, { name }, { new: true });
        res.status(200).json({
            success: true,
            user
        })
    },

    obtenerUsuariosPaginado: async (req, res) => {
        const { limit = 5, from = 0 } = req.query;

        //optimizacion de codigo
        //multiples peticiones para ahorrar tiempo
        //total guarda la primer petecion
        //users guarda la segunda peticion 
        const [total, users] = await Promise.all([
            User.countDocuments(),
            User.find().limit(Number(limit)).skip(Number(from))
        ]);

        res.status(200).json({
            success: true,
            total,
            response: users,
        })
    },

    desactivarUsuario: async (req, res) => {

        const { id } = req.params;

        const user = await User.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            response: user
        })
    }
}

module.exports = userController;