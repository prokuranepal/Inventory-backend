const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({

    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine'
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('OrderItem', OrderItemSchema);