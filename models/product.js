const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description: String,
    price:{type:Number, required:true},
})

new Product = mongoose.model('Product', productSchema)