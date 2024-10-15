import express from "express"
import {register, login} from '../controllers/authController.js'
import { upload } from "../storage.js" 

const router = express.Router()

router.post('/register', upload.single('image'), register)
router.post('/login', login)

export default router