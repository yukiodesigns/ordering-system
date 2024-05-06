const express = require('express')
const User = require('../models/user')
const authMiddleware = require('../middleware/auth')
const router = express.Router()

router.get('/:id/products', authMiddleware, async(req, res)=>{
    try {
        const user = await User.findById(req.params.id).populate('cart.products');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const cartProducts = user.cart.products;
        res.json(cartProducts);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
      }
})
router.get('/:id/profile', authMiddleware, async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
      }
})
router.post('/:id/cart', authMiddleware, async(req,res)=>{
    try {
        const productId = req.body.productId;
    
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.cart.products.push(productId);
        await user.save();
    
        res.json({ message: 'Product added to cart successfully' });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
      }
})
router.put('/:id/profile', authMiddleware, async(req, res)=>{
    try {
        const updatedProfile = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, updatedProfile, { new: true });
        if (!user)  return res.status(404).json({ message: 'User not found' });
        res.json(user);
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
      }
})
router.delete('/:id/productId', authMiddleware, async(req, res)=>{
    try {
        const productId = req.params.productId;

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const productIndex = user.cart.products.indexOf(productId);
        if (productIndex === -1)  return res.status(404).json({ message: 'Product not found in cart' });

        user.cart.products.splice(productIndex, 1);
        await user.save();
        res.json({ message: 'Product removed from cart successfully' });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
      }
})
router.delete('/:id/profile', authMiddleware, async(req, res)=>{
    try {
        const user =  await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).json({ message: 'User not found' })
        res.json({message: 'User deleted'})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
})

module.exports = router