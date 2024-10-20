import Events from '../models/Events.js'
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
        const newEvent = await Events.add({
            type,
            title,
            host,
            duration,
            image: imagePath,
            description,
            ticketPrice,
            specificDateInfo : specificDateInfoObj
        })

        res.status(201).json({
            event: newEvent,
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
        const userID = req.user.id
        const eventID = req.params.id
        const event = await Events.findByID(eventID)

        console.log(event)

        // check
        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            })
        }

        if (userID !== event.host) {
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

        await Events.delete(eventID)

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
}

const getSingleEvent = async (req, res) => {
}

const getEventsByType = async (req, res) => {
}

const getEventsByHost = async (req, res) => {
}

const getEventsByNewest = async (req, res) => {
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