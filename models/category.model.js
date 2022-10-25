const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({

    name: { type: String, required: [true, 'nombre obligatorio!'], unique: true },
    status: { type: Boolean, default: true, required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'user', required: true }

})

categorySchema.methods.toJSON = function () {

    const { __v, ...category } = this.toObject();
    return category;
}

module.exports = mongoose.model('category', categorySchema);