import express from "express"
import { createEvent, deleteEvent, updateEvent, getSingleEvent, getEventsByType, getEventsByNewest, getEventsByHost, getEventsFromSearch } from "../controllers/eventController.js"
import { upload } from "../storage.js" 
import { verifyToken } from "../middleware/authorization.js"

const router = express.Router()

router.use(verifyToken)

router.post("/", upload.single('image'), createEvent)
router.put("/:id", upload.single('image'), updateEvent)
router.delete("/:id", deleteEvent)
router.get("/search", getEventsFromSearch)
router.get("/type", getEventsByType)
router.get("/host", getEventsByHost)
router.get("/newest", getEventsByNewest)
router.get("/:id", getSingleEvent)

export default router