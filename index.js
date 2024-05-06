const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); 
dotenv.config(); 

const port = process.env.PORT || 3000;
const adminRoutes = require('./routes/admin');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');

const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// Define routes
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});
