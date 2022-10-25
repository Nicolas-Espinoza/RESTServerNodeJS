const express = require('express');
const cors = require('cors');
const fileupload = require('express-fileupload');

const userRoutes = require('../routes/user.routes');
const authRoutes = require('../routes/auth.routes');
const categoryRoutes = require('../routes/categorias.routes');
const productRoutes = require('../routes/producto.routes');
const searchRoutes = require('../routes/search.routes');
const uploadsRoutes = require('../routes/uploads.routes');

const dbConnection = require('../database/config');


class Server {
    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        //conectar DB
        this.connectDB();
        //Middlewares
        this.middlewares();
        //Rutas de mi App
        this.routes();
    };

    async connectDB() {
        await dbConnection();
    }

    routes() {
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/usuarios', userRoutes);
        this.app.use('/api/categorias', categoryRoutes);
        this.app.use('/api/productos', productRoutes);
        //falta hacer bien esta ruta!
        this.app.use('/api/search', searchRoutes);
        this.app.use('/api/uploads', uploadsRoutes);
    }

    startServer() {
        this.app.listen(this.port, () => {
            console.log(`App is running on port ${this.port}`);
        })
    }

    //estos se ejecutan con el servidor
    middlewares() {
        //Directorio publico es decir '/'
        this.app.use(express.static('public'));
        //CORS
        this.app.use(cors());
        //Parseo
        this.app.use(express.json());
        //conf para la subida de archivos
        //createParentPath es para permitir crear carpetas
        this.app.use(fileupload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }))
    }
}

module.exports = Server;

