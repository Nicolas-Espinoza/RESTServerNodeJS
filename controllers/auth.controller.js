const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generarJWT = require('../helpers/generarJWT');
const googleVerify = require('../helpers/google-token-validator');


const authController = {

    loguearUsuario: async (req, res) => {

        const { mail, password } = req.body;

        try {

            //verificar usuario por mail
            const user = await User.findOne({ mail });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    response: 'mail o password incorrecto - mail'
                })
            }

            //verificar si el usuario esta activo

            if (!user.status) {

                return res.status(400).json({
                    success: false,
                    response: 'mail o password incorrecto - status'
                })

            }

            //verificar el password
            const validatePassword = bcrypt.compareSync(password, user.password);

            if (!validatePassword) {
                return res.status(400).json({
                    success: false,
                    response: 'mail o password incorrecto - password'
                })
            }

            //generar el token
            const token = await generarJWT(user.id);

            return res.status(200).json({
                success: true,
                response: token,
            })

        } catch (e) {
            return res.status(500).json({
                success: false,
                response: e
            })
        }
    },

    loguearUsuarioGoogle: async (req, res) => {

        const { id_token } = req.body;

        try {

            const { name, mail, avatar } = await googleVerify(id_token);

            let user = await User.findOne({ mail });

            if (!user) {
                //crear el usuario
                const data = {
                    name,
                    mail,
                    avatar,
                    password: 'palabra-secreta',
                    role: 'USER_ROLE',
                    google: true
                }
                user = new User(data);
                await user.save();
            }
            //verificar que la cuenta del usuario este activa
            if (!user.status) {
                return res.status(401).json({
                    success: false,
                    response: 'Usuario bloqueado - status: false',
                })
            }

            //generar el JWT una vez guardado el nuevo usuario
            const token = await generarJWT(user.id);

            return res.status(200).json({
                success: true,
                response: token,
                lugar: 'ruta de auth',
                user
            })

        } catch (error) {

            return res.status(500).json({
                success: false,
                response: error
            })
        }
    }
}

module.exports = authController;