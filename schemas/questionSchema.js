const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "Author"
    }
});


module.exports = questionSchema;