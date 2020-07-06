const mongoose = require('mongoose');


const DroneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'unactive', 'destroyed'],
        default: 'unactive'
    },
    type: {
        type: String,
        enum: ['VTOL', 'Plane', 'Quad', 'Octo', 'Hexa'],
        default: 'Quad'
    },
    mission: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission'
    }],
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospital'
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('Drone', DroneSchema);