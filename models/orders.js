const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({

    medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const OrderSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    orderItem:
        [OrderItemSchema],

    date_order: {
        type: Date,
        required: true
    },
    origin: {
        type: String,
        required: true
    },
    created_User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Destination: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Processing'


    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Orders', OrderSchema);