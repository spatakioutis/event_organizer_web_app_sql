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