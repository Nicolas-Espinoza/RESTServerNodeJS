const path = require('path');
const fs = require('fs');

//config de cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');
const uploadFile = require('../helpers/uploadFile');

const User = require('../models/user.model');
const Product = require('../models/producto.model');


const uploadsController = {

    cargarArchivo: async (req = request, res = response) => {

        try {

            //esta funcion personalizada sirve para
            //subir el archivo con un nombre creado a una X carpeta
            const fileName = await uploadFile(req.files);

            return res.json({
                success: true,
                response: fileName
            })



        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },

    editarArchivo: async (req = request, res = response) => {

        try {


            const { id, collection } = req.params;
            let model;


            switch (collection) {

                case 'users':

                    model = await User.findById(id)

                    if (!model) {
                        return res.status(400).json({
                            success: false,
                            response: `No existe un usuario con ID: ${id}`
                        })
                    }
                    break;

                case 'products':

                    model = await Product.findById(id)

                    if (!model) {
                        return res.status(400).json({
                            success: false,
                            response: `No existe un producto con ID: ${id}`
                        })
                    }
                    break;

                default:
                    return res.status(500).json({
                        success: false,
                        response: 'collection no validada!'
                    })
            }

            //antes de subir el archivo limpiar imagenes previas!!
            //ver que mi modelo tenga la prop img
            if (model.img) {

                //crear la ruta del archivo para su busqueda con fs
                const pathImg = path.join(__dirname, '../uploads', collection, model.img);
                //buscamos el archivo, si existe lo borramos!
                if (fs.existsSync(pathImg)) {

                    fs.unlinkSync(pathImg);
                }

            }

            //actualizo la propiedad img de mi modelo!
            const fileName = await uploadFile(req.files, collection);
            model.img = fileName;
            await model.save();

            res.status(200).json({
                success: true,
                response: model
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },

    eliminarArchivo: async (req, res) => {

        try {

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },

    obtenerArchivo: async (req = request, res = response) => {

        try {

            const { id, collection } = req.params;

            let model;

            switch (collection) {

                case 'users':

                    model = await User.findById(id)

                    if (!model) {
                        return res.status(400).json({
                            success: false,
                            response: `No existe un usuario con ID: ${id}`
                        })
                    }
                    break;

                case 'products':

                    model = await Product.findById(id)

                    if (!model) {
                        return res.status(400).json({
                            success: false,
                            response: `No existe un producto con ID: ${id}`
                        })
                    }
                    break;

                default:
                    return res.status(500).json({
                        success: false,
                        response: 'collection no validada!'
                    })
            }

            const noImagePath = path.join(__dirname, '../assets', '404notFound.jpg');

            if (model.img) {

                const pathImg = path.join(__dirname, '../uploads', collection, model.img);

                if (fs.existsSync(pathImg)) {
                    return res.sendFile(pathImg);
                }
            }

            return res.sendFile(noImagePath);

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },

    editarArchivoCloudinary: async (req = request, res = response) => {

        try {


            const { id, collection } = req.params;
            let model;


            switch (collection) {

                case 'users':

                    model = await User.findById(id)

                    if (!model) {
                        return res.status(400).json({
                            success: false,
                            response: `No existe un usuario con ID: ${id}`
                        })
                    }
                    break;

                case 'products':

                    model = await Product.findById(id)

                    if (!model) {
                        return res.status(400).json({
                            success: false,
                            response: `No existe un producto con ID: ${id}`
                        })
                    }
                    break;

                default:
                    return res.status(500).json({
                        success: false,
                        response: 'collection no validada!'
                    })
            }

            //antes de subir el archivo limpiar imagenes previas!!
            //ver que mi modelo tenga la prop img
            if (model.img) {
                //sacamos el id de img de cloudinary
                const arrayNameFile = model.img.split('/');
                const id = arrayNameFile[arrayNameFile.length - 1];
                const [public_id] = id.split('.');

                cloudinary.uploader.destroy(public_id);

            }

            //extraigo el almacenamiento temporal, para no almacenarlo en mi backend
            //recordemos que archivo es de postman!
            const { tempFilePath } = req.files.archivo;

            const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

            model.img = secure_url;
            await model.save();

            res.status(200).json({
                success: true,
                response: model
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                response: error
            })
        }
    },
}

module.exports = uploadsController;