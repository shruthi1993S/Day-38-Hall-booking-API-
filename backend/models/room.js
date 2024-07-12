const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    numberOfSeats: Number,
    amenities: [String],
    pricePerHour: Number,
    name: String
});

module.exports = mongoose.model('Room', RoomSchema);

