const mongoose = require("mongoose");


const VaccineSchema = new mongoose.Schema({

    vaccineName: {
        type: String,
        required: true
    },

    vaccineUsedFor: {
        type: String,
        required: true
    },

    expiryDateTime: {
        type: Date,
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

module.exports = mongoose.model('Vaccine', VaccineSchema);

