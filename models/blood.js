const mongoose = require('mongoose');


const BloodSchema = new mongoose.Schema({

    bloodGroup: {
        type: String,
        required: true
    },
    collectedDateTime: {
        type: Date,
        required: true
    },
    storedDateTime: {
        type: Date,
        required: true
    },
    expiryDateTime: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true

    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blood', BloodSchema);




