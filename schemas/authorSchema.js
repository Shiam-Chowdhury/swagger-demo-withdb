const mongoose = require('mongoose');

const authorSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    questions: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Question'
        }
    ]
})

module.exports = authorSchema;