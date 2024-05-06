const express = require('express')
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
const admin = require('./routes/admin')
const users = require('./routes/users')
const orders = require('./routes/orders')
const auth = require('./routes/auth')
const app = express()

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


app.use(express.json())
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use('/api/orders', orders)
app.use('/api/admin', admin)

app.listen(port, ()=>{
    console.log(`listening on port: ${port}`)
})