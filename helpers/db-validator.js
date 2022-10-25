const Category = require('../models/category.model');
const Role = require('../models/role.model');
const User = require('../models/user.model');
const Product = require('../models/producto.model');

//recordemos que en el archivo user.routes.js al llamar a la funcion directamente
//en custom, estoy haciendo el codigo (role) => validateRole(role)
const validateRole = async (role = '') => {

    const roleExist = await Role.findOne({ role });

    if (!roleExist) {
        throw new Error(`El role: "${role}" no existe!`);
    }

    return true;

}

const validateEmailExist = async (mail) => {

    const mailExist = await User.findOne({ mail });
    if (mailExist) {
        throw new Error('El mail ya esta en uso!');
    }

    return true;

}

const userExist = async (id) => {

    const userExist = await User.findById(id);
    if (!userExist) {
        throw new Error(`El user con ID: ${id} no existe!`);
    }

    return true;

}

//validar si existe la categoria para no repetir codigo

const categoryNameExist = async (category) => {

    const categoryExist = await Category.findOne({ name: category.toUpperCase() });

    if (categoryExist) {
        throw new Error(`La categoria: ${category} ya existe! db validator`);
    }

    return true;

}


const categoryExistInDB = async (id) => {

    const category = await Category.findById(id);

    if (!category) {
        throw new Error(`la categoria con ID: ${id} no existe!`);
    }

    return true;

}

const productExistInDB = async (id) => {

    const product = await Product.findById(id);
    if (!product) {
        throw new Error(`el producto con ID: ${id} no existe!`);
    }

    return true;

}

module.exports = {
    validateRole,
    validateEmailExist,
    userExist,
    categoryNameExist,
    categoryExistInDB,
    productExistInDB
}