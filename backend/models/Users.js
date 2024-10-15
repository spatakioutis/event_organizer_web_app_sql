import mongoose from "mongoose"
import Event from "./Events.js"
import Booking from "./Bookings.js"

const userSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String, 
        required: true 
    },
    firstName: {
        type: String,
        required: true 
    },
    lastName: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        required: true 
    },
    birthDate: {
        type: Date,
        required: true 
    },
    profilePic: {
        type: String,
        default: 'public/assets/default_pic.png',
    },
    phone: {
        type: String, 
        required: true
    }
}, { timestamps: true })

userSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const userID = this._id

    try {
        // Delete all bookings associated with the user
        await Booking.deleteMany({ user: userID })

        // Find all events hosted by the user
        const eventsHostedByUser = await Event.find({ host: userID })

        await Promise.all(eventsHostedByUser.map(async (event) => {
            await Booking.deleteMany({ event: event._id })
            await event.deleteOne()
        }))

        next()
    } catch (error) {
        next(error)
    }
})

const User = mongoose.model('User', userSchema, 'users')

export default User