import express from "express"
import { changePassword, changeUserInfo, deleteUser } from '../controllers/userController.js'
import { upload } from "../storage.js" 
import { verifyToken } from "../middleware/authorization.js"

const router = express.Router()

router.use(verifyToken)

router.put('/info', upload.single('image'), changeUserInfo)
router.put('/password', changePassword)
router.delete('/', deleteUser)

export default router