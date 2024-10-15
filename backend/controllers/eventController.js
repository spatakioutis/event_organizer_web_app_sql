import Event from "../models/Events.js"
import User from "../models/Users.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const createEvent = async (req, res) => {
    try {

        // get event data
        const host = req.user.id
        const imagePath = req.file.path.replace('public/', '')

        const {
            type,
            title,
            duration,
            description,
            ticketPrice,
            specificDateInfo
        } = req.body

        const specificDateInfoObj = JSON.parse(specificDateInfo)

        for (let info of specificDateInfoObj) {
            info.seatsAvailable = info.totalSeats
        }

        // create new event
        const newEvent = new Event({
            type,
            title,
            host,
            duration,
            image: imagePath,
            description,
            ticketPrice,
            specificDateInfo : specificDateInfoObj
        })

        // save new event
        const savedEvent = await newEvent.save()

        res.status(201).json({
            event: savedEvent,
            message: "Event registration successful"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteEvent = async (req, res) => {
    try {

        // get event
        const userID = req.user.id
        const eventID = req.params.id
        const event = await Event.findById(eventID)

        // check
        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            })
        }

        if (userID !== event.host.toString()) {
            return res.status(400).json({
                message: 'Event does not belong to the user'
            })
        }

        // delete event
        if (event.image) {
            const filePath = path.join(__dirname, 'public/assets', event.image)
            
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err)
                        return res.status(500).json({ message: 'Error deleting file' })
                    }
                    console.log('File deleted successfully')
                })
            }
        }

        await event.deleteOne()

        res.status(200).json({
            message: "Event deleted successfully"
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const updateEvent = async (req, res) => {
    try {

        // get data
        const updatesString = req.body.updates
        const updates = JSON.parse(updatesString)

        if (req.file) {
            const imagePath = req.file.path.replace('public/', '')
            updates.image = imagePath
        }

        const userID = req.user.id
        const eventID = req.params.id
        const event = await Event.findById(eventID)

        // check
        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            })
        }

        if (userID !== event.host.toString()) {
            return res.status(400).json({
                message: 'Event does not belong to the user'
            })
        }

        // update event
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: eventID },
            { $set: updates },
            { new: true, runValidators: true }
        )

        res.status(200).json({
            message: "Event updated successfully",
            event: updatedEvent
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getSingleEvent = async (req, res) => {
    try {

        // get data
        const eventID = req.params.id
        
        // get event
        const event = await Event.findById(eventID)
        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            })
        }

        const host = await User.findById(event.host)

        res.status(200).json({
            message: "Event found successfully",
            event,
            user: {
                _id: host._id,
                firstName: host.firstName,
                lastName: host.lastName,
                username: host.username,
                email: host.email,
                phone: host.phone
            }
        })

    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getEventsByType = async (req, res) => {
    try {
        // get data
        const { type, fetchAll } = req.query

        // get events
        const today = new Date()
        let events = await Event.find({ type, 'specificDateInfo.date': { $gte: today } })
                                .sort({ createdAt: -1 })

        if (fetchAll === "false") {
            events = events.slice(0,4)
        }
                        
        // get only essential
        const eventData = events.map(event => {

            const dates = event.specificDateInfo.map(info => info.date)
            const locations = event.specificDateInfo.map(info => info.location)

            return {
                _id: event._id,
                title: event.title,
                image: event.image,
                dates,
                locations
            }
        })

        res.status(200).json({
            message: "Events found by type successfully",
            events: eventData
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getEventsByHost = async (req, res) => {
    
    try {
        const hostId = req.user.id

        // get events by this host
        const eventsByHost = await Event.find({ host: hostId })
                                        .sort({ createdAt: -1 })
        if (!eventsByHost.length) {
            return res.status(404).json({
                message: "No events found for this host."
            })
        }

        const eventData = eventsByHost.map(event => {

            const dates = event.specificDateInfo.map(info => info.date)
            const locations = event.specificDateInfo.map(info => info.location)

            return {
                _id: event._id,
                title: event.title,
                image: event.image,
                dates,
                locations
            }
        })

        res.status(200).json({
            message: "Events found by host successfully",
            events: eventData
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getEventsByNewest = async (req, res) => {
    try {

        const { fetchAll } = req.query
        // get events
        const today = new Date()
        let events = await Event.find({ 'specificDateInfo.date': { $gte: today } })
                                .sort({ createdAt: -1 })

        if (fetchAll === "false") {
            events = events.slice(0,4)
        }

        // get only essential
        const eventData = events.map(event => {

            const dates = event.specificDateInfo.map(info => info.date)
            const locations = event.specificDateInfo.map(info => info.location)

            return {
                _id: event._id,
                title: event.title,
                image: event.image,
                dates,
                locations
            }
        })

        res.status(200).json({
            message: "Events found by newest successfully",
            events: eventData
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getEventsFromSearch = async (req, res) => {
    try {
        const {searchQuery} = req.query

        const results = await Event.find({ 
            title: { $regex: searchQuery, $options: 'i' } 
        })
        .limit(10)

        const events = results.map(event => {
            return {
                title: event.title,
                eventID: event._id
            }
        })

        res.status(200).json({
            message: "Events from search fetched successfully",
            events
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export { 
    createEvent,
    deleteEvent, 
    updateEvent, 
    getSingleEvent, 
    getEventsByType, 
    getEventsByHost, 
    getEventsByNewest,
    getEventsFromSearch
}