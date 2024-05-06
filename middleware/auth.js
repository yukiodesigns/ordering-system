const jwt = require('jsonwebtoken')
const { model } = require('mongoose')

function authMiddleware(req, res, next){
    const token = req.header('Authorization')
    if(!token) return res.status(401).send('Access denied')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(400).json({message: 'Invalid token'})
    }
}

model.export = authMiddleware