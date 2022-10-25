const jwt = require('jsonwebtoken');


const generarJWT = (uid) => {

    return new Promise((resolve, reject) => {

        const payload = { uid }

        jwt.sign(payload, process.env.SECRETORPUBLICKEY, {
            expiresIn: '365d'
        }, (err, token) => {
            if (err) {
                console.log('error jwt', err);
                reject('No se pudo generar el jwt!')
            } else {
                resolve(token);
            }
        })
    })
}


module.exports = generarJWT;