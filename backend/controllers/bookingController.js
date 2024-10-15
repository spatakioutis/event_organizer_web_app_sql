import Booking from "../models/Bookings.js"
import Event from "../models/Events.js"

const createBooking = async (req, res) => {
    try {

        const userID = req.user.id

        const {
            eventID,
            date, 
            numOfTickets
        } = req.body

        const event = await Event.findById(eventID) 
        
        const targetDate = new Date(date).toISOString()
        const info = event.specificDateInfo.find(info => info.date.toISOString() === targetDate)

        if ( info.seatsAvailable < numOfTickets ) {
            return res.status(400).json({
                message: "Not enough available seats"
            })
        }

        const newBooking = new Booking({
            user: userID,
            event: eventID,
            date,
            numOfTickets
        })

        const savedBooking = await newBooking.save()

        res.status(201).json({
            booking: savedBooking,
            message: "Booking registration successful"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteBooking = async (req, res) => {
    try {
        const userID = req.user.id
        const bookingID = req.params.id

        const booking = await Booking.findById(bookingID)

        if ( !booking ) {
            return res.status(404).json({
                message: 'Booking not found'
            })
        }

        if ( userID !== booking.user.toString() ) {
            return res.status(400).json({
                message: 'Booking does not belong to the user'
            })
        }

        await booking.deleteOne()

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

        const bookings = await Booking.find({user: userID})
                                      .sort({ date: 1 })


        let bookingsInfo = await Promise.all(bookings.map(async (booking)  => { 

            if ( (booking.date >= today && bookingsStatus === 'upcoming') || 
                 (booking.date < today && bookingsStatus === 'past') ) {
                
                const event = await Event.findById(booking.event)

                return {
                    bookingDetails: booking, 
                    image:          event.image, 
                    title:          event.title
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