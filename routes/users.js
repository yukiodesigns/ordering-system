const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user exists
const checkUserExists = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!user.cart) {
      user.cart = { products: [] }; 
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

router.get('/:id/products', authMiddleware, checkUserExists, (req, res) => {
  try {
    const cartProducts = req.user.cart.products;
    res.json(cartProducts);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/:id/profile', authMiddleware, checkUserExists, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});


router.post('/:id/cart', checkUserExists, async (req, res) => {
  try {
    const productId = req.body.productId;
    req.user.cart.products.push(productId);
    await req.user.save();
    res.json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/:id/profile', authMiddleware, checkUserExists, async (req, res) => {
  try {
    const updatedProfile = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updatedProfile, { new: true });
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/:id/cart/:productId', authMiddleware, checkUserExists, async (req, res) => {
  try {
    const productId = req.params.productId;
    const productIndex = req.user.cart.products.indexOf(productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }
    req.user.cart.products.splice(productIndex, 1);
    await req.user.save();
    res.json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/:id/profile', authMiddleware, checkUserExists, async (req, res) => {
  try {
    await req.user.remove();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
