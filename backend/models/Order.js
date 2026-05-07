const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: Number,
        name: String,
        quantity: Number,
        price: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingDetails: {
        address: String,
        city: String,
        phone: String
    },
    paymentMethod: {
        type: String,
        default: 'Cash on Delivery'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);