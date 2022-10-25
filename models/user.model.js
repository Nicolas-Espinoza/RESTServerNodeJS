const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio!']
    },
    mail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { type: String, require: false },
    role: { type: String, require: true, enum: ['ADMIN_ROLE', 'USER_ROLE'] },
    status: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

//esta funcion sirve para no enviar o mostrar ciertos campos
userSchema.methods.toJSON = function () {
    //esto sirve para quitar los campos, y el resto guardarlo en ...user
    //toObject me genera una instancia de mi modelo
    const { __v, password, _id, ...user } = this.toObject();
    //agregando la propiedad uid a mi modelo user que toma el valor del _id
    user.uid = _id;
    return user;
}

module.exports = mongoose.model('user', userSchema);