
// //obtener productos - publico
// //obtener producto - publico

// //actualizar producto - cualquier usuario con token
// //desactivar producto - admin
// //eliminar producto - admin

const Product = require('../models/producto.model');

const productsController = {

    crearProducto: async (req, res) => {

        try {

            const data = {
                name: req.body.name,
                user: req.user._id,
                price: req.body.price,
                category: req.body.category,
                description: req.body.description
            }

            const producto = new Product(data)
            await producto.save();

            return res.status(201).json({
                success: true,
                response: producto
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },


    obtenerProductos: async (req, res) => {

        try {
            const { limit = 5, from = 0 } = req.query;

            const [total, productos] = await Promise.all([
                Product.countDocuments(),
                Product.find().limit(Number(limit)).skip(Number(from))
                    .populate('user', 'name')
                    .populate('category', 'name')
            ])

            return res.status(200).json({
                success: true,
                response: {
                    total,
                    productos
                }
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },



    obtenerProducto: async (req, res) => {
        try {

            const { id } = req.params;
            const product = await Product.findById(id);

            return res.status(200).json({
                success: true,
                response: product
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },

    actualizarProducto: async (req, res) => {

        try {

            const { id } = req.params;
            const product = await Product.findByIdAndUpdate(id, {
                ...req.body,
                user: req.user._id
            }, { new: true });

            res.status(200).json({
                success: true,
                response: product
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }

    },


    desactivarProducto: async (req, res) => {

        try {

            const { id } = req.params;
            const { status } = req.body;

            const product = await Product.findByIdAndUpdate(id, { status }, { new: true });

            res.status(200).json({
                success: true,
                response: product
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }

    },


    eliminarProducto: async (req, res) => {

        try {
            const { id } = req.params;

            const product = await Product.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                response: product
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }

    },

}

module.exports = productsController;