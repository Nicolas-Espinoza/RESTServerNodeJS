const extensiones = [
    'png',
    'jpg',
    'jpeg',
    'gif'
]

//funcion para rescatar el directorio de las carpetas!
const path = require('path');
//uuid para generar nombre para nuestros archivos!
const { v4: uuidv4 } = require('uuid');

//el parametro folder sirve para separar por user, product etc

const uploadFile = (files, folder = '') => {

    //retornar una promesa

    return new Promise((resolve, reject) => {

        //archivo es la variable que recibo desde el postman!! importante!!
        const { archivo } = files;

        //separamos el nombre en un arreglo
        const shortName = archivo.name.split('.');

        //sacamos la extension del archivo!
        const extension = shortName[shortName.length - 1];

        //verificar que la extension sea permitida
        if (!extensiones.includes(extension)) {

            return reject(`La extension ${extension} no es valida!`);
        }

        //crear nombre temp del archivo!
        const nameFile = uuidv4() + '.' + extension;

        //ruta donde voy a guardar el archivo!
        const uploadPath = path.join(__dirname, '../uploads/', folder, nameFile);

        //funcion para mover mi archivo a la ruta de uploadPath

        archivo.mv(uploadPath, (error) => {

            if (error) {
                return reject(error);
            }

            resolve(nameFile);
        })
    })
}


module.exports = uploadFile;