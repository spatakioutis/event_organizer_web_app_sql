import Users from '../queries/Users.js'
import bcrypt from 'bcryptjs'
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const changeUserInfo = async (req, res) => {
    try {
        const userID = req.user.id
        const updates = req.body

        if (req.file) {
            const imagePath = req.file.path.replace('public/', '')
            updates.profilePic = imagePath
        }

        const updatedUser = await Users.update({id: userID, updates: updates})

        delete updatedUser.user_password

        res.status(200).json({
            message: "User info updated successfully",
            user: {
                username:   updatedUser.username,
                firstName:  updatedUser.firstname,
                lastName:   updatedUser.lastname,
                email:      updatedUser.email,
                profilePic: updatedUser.profilepic,
                phone:      updatedUser.phone,
                _id:         updatedUser.user_id
            }
        })
    }
    catch (error) {
        if (error.code == '23505') {
            return res.status(400).json({
                message: 'Username already exists'
            })
        }
        res.status(500).json({
            message: error.message
        })
    }
}

const changePassword = async (req, res) => {
    const {oldPassword, newPassword} = req.body
    const userID = req.user.id

    try {
        const user = await Users.findByID(userID)

        const passwordMatch = await bcrypt.compare(oldPassword, user.user_password)
        if (!passwordMatch) {
            return res.status(401).json({ 
                error: 'Invalid password'
            })
        }

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        await Users.updatePassword({id: userID, password: hashedPassword})

        res.status(200).json({
            message: 'Password changed successfully'
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const deleteUser = async (req, res) => {
    const {password} = req.query
    const userID = req.user.id

    try {
        const user = await Users.findByID(userID)

        const passwordMatch = await bcrypt.compare(password, user.user_password)
        if (!passwordMatch) {
            return res.status(401).json({ 
                error: 'Invalid password'
            })
        }

        if (user.profilepic) {
            const filePath = path.join(__dirname, 'public/assets', user.profilepic)

            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('[Server] Error deleting file:', err)
                        return res.status(500).json({ message: 'Error deleting file' })
                    }
                    console.log('[Server] File deleted successfully')
                })
            }
        }

        await Users.delete(userID)

        res.status(200).json({
            message: 'User deleted successfully'
        })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

export { 
    changeUserInfo, 
    changePassword, 
    deleteUser 
}