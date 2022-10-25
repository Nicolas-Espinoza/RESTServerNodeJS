const collections = [
    'users',
    'products',
    'roles'
]

const validateCollections = (collection = '') => {

    if (!collections.includes(collection)) {

        throw new Error(`La coleccion ${collection} no esta permitida o no existe!`);
    }

    return true;
}

module.exports = validateCollections;