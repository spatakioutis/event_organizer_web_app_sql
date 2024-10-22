import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import { fileURLToPath } from "url"

import { updateEventStatus } from "./scheduledTaskManager.js"

import authRoute from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import eventRoute from "./routes/eventRoute.js"
import bookingRoute from "./routes/bookingRoute.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()

const app = express()

app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, "public/assets")))

// routes
app.use('/auth', authRoute)
app.use('/users', userRoute)
app.use('/events', eventRoute)
app.use('/bookings', bookingRoute)

// scheduled scannings for database updates
setInterval(updateEventStatus,  24 * 60 * 60 * 1000)

const PORT = process.env.PORT || 6001

app.listen(PORT, () => {
	console.log(`[Server] Listening on port ${PORT}`)
})