const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },

    orderItem: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem'

    }],
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
},{
        timestamps: true
    })

module.exports = mongoose.model('Orders', OrderSchema);