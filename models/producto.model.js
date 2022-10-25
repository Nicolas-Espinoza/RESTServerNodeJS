const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    name: { type: String, required: true },
    status: { type: String, default: true },
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    price: { type: Number, default: 0 },
    category: { type: mongoose.Types.ObjectId, ref: 'category', required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    img: { type: String }

})

productSchema.methods.toJSON = function () {
    const { _v, status, ...product } = this.toObject();
    return product;
}

module.exports = mongoose.model('product', productSchema);