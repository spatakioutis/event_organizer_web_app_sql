import Users from '../models/Users.js'
import bcrypt from 'bcryptjs'
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const changeUserInfo = async (req, res) => {
    try {
        // get data
        const userID = req.user.id
        const {updates} = req.body

        if (req.file) {
            const imagePath = req.file.path.replace('public/', '')
            updates.profilePic = imagePath
        }

        // update user
        const updatedUser = await Users.update({id: userID, updates})

        delete updatedUser.user_password

        res.status(200).json({
            message: "User info updated successfully",
            user: updatedUser
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
        const user = await Users.findByID({id: userID})

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
        const user = await Users.findByID({id: userID})

        // ask for password
        const passwordMatch = await bcrypt.compare(password, user.user_password)
        if (!passwordMatch) {
            return res.status(401).json({ 
                error: 'Invalid password'
            })
        }

        // delete user
        if (user.profilePic) {
            const filePath = path.join(__dirname, 'public/assets', user.profilePic)

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

        await Users.delete({id: userID})

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

export { changeUserInfo, changePassword, deleteUser }