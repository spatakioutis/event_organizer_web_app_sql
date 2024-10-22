import Bookings from "../models/Bookings.js"
import Events from "../models/Events.js"

const createBooking = async (req, res) => {
    try {
        const userID = req.user.id

        const {
            eventID,
            date, 
            numOfTickets
        } = req.body

        const targetDate = new Date(date).toISOString()

        const eventDateInfo = await Events.updateSeatCount({
            id: eventID, 
            date: targetDate, 
            amount: numOfTickets
        })

        const newBooking = await Bookings.add({
            user: userID,
            eventDateID: eventDateInfo.event_dates_id,
            numOfTickets
        })

        res.status(201).json({
            booking: newBooking,
            message: "Booking registration successful"
        })
    }
    catch (error) {
        if (error.code === '23514') {
            return res.status(400).json({
                message: 'Not enough available seats'
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteBooking = async (req, res) => {
    try {
        const userID = req.user.id
        const bookingID = req.params.id

        const booking = await Bookings.findByID(bookingID)

        if ( !booking ) {
            return res.status(404).json({
                message: 'Booking not found'
            })
        }

        if ( userID !== booking.user_id ) {
            return res.status(400).json({
                message: 'Booking does not belong to the user'
            })
        }

        await Bookings.delete(bookingID)

        res.status(200).json({
            message: "Booking deleted successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getUserBookings = async (req, res) => {
    try {
        const userID = req.user.id
        const {bookingsStatus} = req.params
        const today = new Date()

        const bookings = await Bookings.findByHost(userID)

        let bookingsInfo = await Promise.all(bookings.map(async (booking)  => { 

            if ( (booking.date >= today && bookingsStatus === 'upcoming') || 
                 (booking.date < today && bookingsStatus === 'past') ) {

                return {
                    bookingDetails: {
                        _id: booking.booking_id,
                        date: booking.date,
                        numOfTickets: booking.numoftickets,
                        event: booking.event_id,
                        user: booking.user_id,
                    }, 
                    image:          booking.image, 
                    title:          booking.title
                }
            }

            return null
        }))

        bookingsInfo = bookingsInfo.filter(info => info !== null)

        res.status(200).json({
            bookings: bookingsInfo,
            message: 'User Bookings found successfully'
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    } 
}

export { createBooking, deleteBooking, getUserBookings }