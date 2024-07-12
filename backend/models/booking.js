const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    customerName: String,
    date: Date,
    startTime: String,
    endTime: String,
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    bookingDate: { type: Date, default: Date.now },
    bookingStatus: { type: String, enum: ['confirmed', 'pending', 'cancelled'], default: 'confirmed' }
});

module.exports = mongoose.model('Booking', BookingSchema);

