const mongoose = require('mongoose');

const dbConnection = async () => {
    try {

        mongoose.connect(process.env.MONGO_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Database Connected!');

    } catch (e) {
        console.log(e);
        throw new Error('Error en la conexion DB');
    }
}

module.exports = dbConnection;