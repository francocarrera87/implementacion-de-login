const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const itemSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true },
    genero: { type: String, required: true }
});

itemSchema.plugin(mongoosePaginate);

const itemModel = mongoose.model('items', itemSchema);

module.exports = itemModel;
