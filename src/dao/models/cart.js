const mongoose = requiere ('mongoose')

const cartSchema = new mongoose.Schema({
    items: {
        type:[{
            item: String,
            quiatity: Number
        }],
        default: []
    }
})

const cartModel = mongoose.model('carts',cartSchema)
module.export = cartModel;