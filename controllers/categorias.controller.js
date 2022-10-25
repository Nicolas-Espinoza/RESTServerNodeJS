const Category = require('../models/category.model');

//obtener categorias - paginado - total - populate - listo
//obtener categoria - retorna el objeto populado - listo
//actualizar categoria - verificar que no exista en la DB - actualizar usuario que hizo la actualizacion - listo
//desactivar categoria -- listo
//borrar categoria - listo!


const categoryController = {

    crearCategoria: async (req, res) => {

        const name = req.body.name.toUpperCase();

        //Generar la data a guardar
        const data = {
            name,
            user: req.user._id
        }

        const category = new Category(data);
        await category.save();


        return res.status(201).json({
            success: true,
            response: category
        })

    },

    editarCategoria: async (req, res) => {

        const { name } = req.body;
        const { id } = req.params;

        const data = {
            name: name.toUpperCase(),
            user: req.user._id
        }
        try {

            const category = await Category.findByIdAndUpdate(id, { ...data }, { new: true });

            return res.status(200).json({
                success: true,
                response: category
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },

    eliminarCategoria: async (req, res) => {

        try {
            const { id } = req.params;

            const category = await Category.findByIdAndDelete(id);

            res.status(200).json({
                success: true,
                response: category
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },

    desactivarCategoria: async (req, res) => {

        const { status } = req.body;
        const { id } = req.params;

        try {

            const category = await Category.findByIdAndUpdate(id, { status }, { new: true });

            return res.status(201).json({
                success: true,
                response: category
            })


        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },

    obtenerUnaCategoria: async (req, res) => {

        const { id } = req.params;

        try {

            const category = await Category.findById(id).populate('user', 'name');

            if (!category) {
                return res.status(404).json({
                    success: false,
                    response: `La categoria con ID: ${id} no existe!`
                })
            }

            return res.status(200).json({
                success: true,
                response: category
            })

        } catch (error) {
            console.log('error endpoint getCategoryById', error)
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },

    obtenerCategorias: async (req, res) => {

        const { limit = 5, from = 0 } = req.query;

        try {

            const [total, categories] = await Promise.all([
                Category.countDocuments(),
                Category.find({ status: true }).limit(Number(limit)).skip(Number(from)).populate('user', 'name')
            ])

            return res.status(200).json({
                success: true,
                response: {
                    total,
                    categories
                }
            })

        } catch (error) {
            console.log('err endpoint get all', error);
            return res.status(500).json({
                success: false,
                response: error
            })
        }

    },


}

module.exports = categoryController;