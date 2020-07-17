const mongoose = require("mongoose");

const HealthFacilitiesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    employee: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    medicine: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine'
    }],
    gps_location: {
        'type': {
            type: String,
            required: false,
            enum: ['Point']
        },
        coordinates: [Number],
        select: false
    },
    drone: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drone'
    }],
    healthpost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthFacilities'
    }],
    type: {
        type:String,
        enum: ['hospital','healthpost'],
        required: true
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('HealthFacilities', HealthFacilitiesSchema);