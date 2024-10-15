import express from "express"
import { verifyToken } from "../middleware/authorization.js"
import { createBooking, deleteBooking, getUserBookings } from "../controllers/bookingController.js"

const router = express.Router()

router.use(verifyToken)

router.post("/", createBooking)
router.delete("/:id", deleteBooking)
router.get("/:bookingsStatus", getUserBookings)

export default router