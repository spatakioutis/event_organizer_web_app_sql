import mongoose from "mongoose"
import Event from './Events.js'

const bookingsSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
    event: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	numOfTickets: {
		type: Number,
		required: true,
		min: [1, 'Number of tickets must be an integer greater than 1 ']
	}
}, { timestamps: true })

bookingsSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        const event = await Event.findById(this.event)

		if ( event ) {
			event.specificDateInfo.forEach(dateInfo => {
				if (dateInfo.date.toISOString() === this.date.toISOString()) {
					dateInfo.seatsAvailable += this.numOfTickets
				}
			})
			await event.save()
		}
		
		next()
    } catch (error) {
        next(error)
    }
})

bookingsSchema.post('save', { document: true, query: false }, async function() {
    try {
        const event = await Event.findById(this.event)

		if ( event ) {
			event.specificDateInfo.forEach(dateInfo => {
				if (dateInfo.date.toISOString() === this.date.toISOString()) {
					dateInfo.seatsAvailable -= this.numOfTickets
				}
			})
			await event.save()
		}

    } catch (error) {
        next(error)
    }
})

const Booking = mongoose.model('Booking', bookingsSchema, 'bookings')

export default Booking