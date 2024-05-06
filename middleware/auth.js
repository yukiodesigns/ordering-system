const jwt = require('jsonwebtoken')
const User = require('../models/user')

async function authMiddleware(req, res, next){
    const token = req.header('Authorization')
    if(!token) return res.status(401).send('Access denied')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user) throw new Error('User not found');
        req.user = user;
        next();
        // const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // req.user = decoded
        // next()
    } catch (error) {
        return res.status(400).json({message: 'Invalid token'})
    }
}

module.exports = authMiddleware