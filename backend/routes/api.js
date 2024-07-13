const express = require('express');
const router = express.Router();
const Room = require('../models/room');
const Booking = require('../models/booking');

// 1.POST /api/rooms
router.post('/rooms', async (req, res) => {
    const { numberOfSeats, amenities, pricePerHour, name } = req.body;
    
    const room = new Room({ numberOfSeats, amenities, pricePerHour, name });
    console.log(room)
    await room.save();
    res.status(201).send(room);
});


// 2.Book a Room
router.post('/bookings', async (req, res) => {
    const { customerName, date, startTime, endTime, roomId } = req.body;
    const booking = new Booking({ customerName, date, startTime, endTime, roomId });
    await booking.save();
    res.status(201).send(booking);
});



// 3.List all Rooms with Booked Data
router.get('/rooms', async (req, res) => {
    const rooms = await Room.find();
    res.send(rooms);
});


// 4.List all customers with booked data

router.get('/booked-customers', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('roomId');

        if (!bookings || bookings.length === 0) {
            return res.status(404).send({ error: 'No bookings found' });
        }

        const bookingDetails = bookings.map(booking => {
            if (!booking.roomId) {
                return null;
            }

            return {
                customerName: booking.customerName,
                roomName: booking.roomId.name, // Assuming room model has a 'name' field
                date: booking.date,
                startTime: booking.startTime,
                endTime: booking.endTime,
            };
        }).filter(detail => detail !== null); // Remove any null entries

        res.send(bookingDetails);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).send({ error: 'Error fetching bookings' });
    }
});


// 5.List how many times a Customer has booked a Room with details
router.get('/customer-bookings', async (req, res) => {
    // Extract customerName from request body
    const { customerName } = req.body;

    try {
        // Check if customerName is provided
        if (!customerName) {
            return res.status(400).send({ error: 'Customer name is required' });
        }

        // Query MongoDB to find bookings for the specified customer
        const bookings = await Booking.find({ customerName }).populate('roomId');

        // Handle case where no bookings are found
        if (!bookings || bookings.length === 0) {
            return res.status(404).send({ error: 'No bookings found for the customer' });
        }

        // Map each booking to include relevant details
        const bookingDetails = bookings.map(booking => ({
            customerName: booking.customerName,
            roomName: booking.roomId.name, // Assuming room model has a 'name' field
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            bookingId: booking._id,
            bookingDate: booking.bookingDate,
            bookingStatus: booking.bookingStatus
        }));

        // Respond with count of bookings and booking details
        res.send({ count: bookings.length, bookings: bookingDetails });
    } catch (error) {
        // Handle any errors that occur during database query or processing
        console.error('Error fetching bookings:', error)
        res.status(500).send({ error: 'Error fetching bookings' });
    }
});


module.exports = router;
