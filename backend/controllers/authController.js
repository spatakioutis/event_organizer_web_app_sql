import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Users from '../models/Users.js'

const register = async (req, res) => {
    
    try {
        const imagePath = req.file.path.replace('public/', '')

        // destruct body
        const {
            username,
            firstName,
            lastName, 
            password,
            email, 
            birthDate,
            phone
        } = req.body

        // encode password
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        // create new user
        const newUser = await Users.add({
            username,
            firstName,
            lastName, 
            password: hashedPassword,
            email, 
            birthDate,
            profilePic: imagePath,
            phone
        })

        res.status(201).json({
            message: 'User registration successful',
            user: {
                username:   newUser.username,
                firstName:  newUser.firstName,
                lastName:   newUser.lastName,
                email:      newUser.email,
                birthDate:  newUser.birthDate,
                profilePic: newUser.profilePic,
                phone:      newUser.phone,
                id:         newUser.id
            }
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        // destruct body
        const {
            username, 
            password
        } = req.body

        // check if user exists
        const user = await Users.findByUsername({username})

        if ( !user ) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.user_password)

        if ( !isMatch ) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        // return token-user
        const token = jwt.sign({ id: user.id }, process.env.JWT_KEY)
        
        delete user.user_password

        res.status(200).json({
            message: "Login sucessful",
            user,
            token
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export { register, login }