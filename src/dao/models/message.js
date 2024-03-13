const mongoose = require ('mongoose');

const messageSchema = new mongoose.Schema({
    user:{
        type: String
    },
    message:{
        type: String
    }
})

const messageModel = mongoose.model('message',messageSchema)

module.exports = messageModel;