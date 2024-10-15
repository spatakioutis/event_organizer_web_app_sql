import jwt from 'jsonwebtoken'

const verifyToken = async (req, res, next) => {
    try {

        // check if token exists
        let token = req.header("Authorization")

        if ( !token ) {
            return res.status(401).json({
                message: "Access denied. No token provided"
            })
        }
        
        if ( token.startsWith("Bearer ") ) {
            token = token.slice(7, token.length).trimLeft()
        }

        // check if token is valid
        const verified = jwt.verify(token, process.env.JWT_KEY)

        if ( !verified ) {
            return res.status(401).json({
                message: "Access denied. Invalid token"
            })
        }

        req.user = verified
        
        next()
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export { verifyToken }