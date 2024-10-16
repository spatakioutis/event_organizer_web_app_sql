
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createEvent = async (req, res) => {
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