const express = require('express')
const Order = require('../models/order')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

router.get('/', async(req, res)=>{
    try {
       const orders = await Order.find() 
       res.send(orders)
    } catch (error) {
       console.error(error.message);
       res.status(500).json({ message: 'Server Error' });
    }

})
router.get('/:id', async(req, res)=>{
    try {
        const order = await Order.findById(req.params.id)
        if(!order) return res.status(404).json({ message: 'Order not found'})
        res.send(order)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' }); 
    }
})
router.delete('/:id',authMiddleware, async(req, res)=>{
    try {
        const order = await Order.findById(req.params.id)
        if(!order) return res.status(404).json({ message: 'Order not found'})

        await order.remove()
        res.json({message: 'Order deleted '})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
})

module.exports = router