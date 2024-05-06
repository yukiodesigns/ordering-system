const express = require('express')
const Product = require('../models/product')
const adminMiddleware = require('../middleware/admin')
const router = express.Router()

router.get('/products', async(req, res)=>{
 try {
    const products = await Product.find() 
    res.send(products)
 } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
 }
})
router.get('/products/:id', async(req, res)=>{
    try {
       const product = await Product.findById(req.params.id)
       if(!product) return res.status(404). json({message:'Product not found'})
       res.send(product) 
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' }); 
    }
})
router.post('/products', async(req, res)=>{
    try {
        const {name, description, price} = req.body
        const product = new Product({name, description, price})
        await product.save()

        res.status(201).send(product)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' }); 
    }
})
router.put('/products/:id', adminMiddleware, async(req, res)=>{
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, 
            {name: req.body.name, description:req.body.description, price: req.body.price}, {new:true})
        if (!product)  return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' }); 
    }
})
router.delete('/products/:id', adminMiddleware, async(req, res)=>{
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product)  return res.status(404).json({ message: 'Product not found' });
        res.json({message: 'Deleted successfully'})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });  
    }
})

module.exports = router