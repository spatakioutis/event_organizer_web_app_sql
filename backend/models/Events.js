import mongoose from "mongoose"
import Booking from "./Bookings.js"

const eventsSchema = mongoose.Schema({
	type: {
		type: String,
		required: true,
		enum: ['Movies', 'Theater', 'Music', 'Sports']
   	},
	host: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	title: {
		type: String,
		required: true
   	},
	duration: {
		type: Number,
		required: true,
		min: [0, 'Duration must be a positive number']
	},
	image: {
		type: String, 
		required: true
	},
	specificDateInfo: [{
		date: {
			type: Date,
			required: true
		},
		location: {
			type: String, 
			required: true
		},
		seatsAvailable: {
			type: Number,
			required: true,
			min: [0, 'Seats available must be a non-negative number']
		},
		totalSeats: {
			type: Number,
			required: true,
			min: [0, 'Total seats must be a non-negative number']
		}
	}],
	status: {
		type: String, 
		enum: ['upcoming', 'ongoing', 'past'],
		default: 'upcoming'
	},
	description: {
		type: String, 
		required: true
	},
	ticketPrice: {
		type: Number, 
		required: true,
		min: [0, 'Ticket price must be a positive number']
	}
}, { timestamps: true })

// Delete all bookings associated with this event
eventsSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const eventID = this._id

    try {
        await Booking.deleteMany({ event: eventID })

        next()
    } catch (error) {
        next(error)
    }
})

const Event = mongoose.model('Event', eventsSchema, 'events')

export default Event