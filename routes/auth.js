const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const router = express.Router()

router.post('/register', async(req, res)=>{
    try {
        const {username, password, email} = req.body
        let user = await User.findOne({email})
        if(user) return res.status(400).json({message:'User already exists'})

        user = new User({username, email, password})

        const hash = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(password, hash)
        await user.save()

        return res.status(201). send("User created")
    } catch (error) {
        console.error(error.message)
    }
})

router.post('/login', async(res, req)=>{
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message: 'Invalid credentials'})

        const isMatch =  await bcrypt.compare( password, user.password)
        if(!isMatch) return res.status(400).json({message: 'Invalid password'})
        const payload = { user:{id:user.id, isAdmin: user.isAdmin}}

        jwt.sign(payload, process.env.JWT_SECRET,(err, token)=>{
            if(err) throw err
            res.json({token})
        })
    } catch (error) {
        console.error(error.message);
    }
})

router.post('/login', async(req, res)=>{
    try {
        res.clearCookie('token');
        res.json({ message: 'Logout successful' }); 
    } catch (error) {
        console.error(error.message)
    }
})

module.exports = router