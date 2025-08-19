import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';
//Add product : /api/product/add
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files;
        let imageUrls = await Promise.all(
            images.map(async (image) => {
                const result = await cloudinary.uploader.upload(image.path, {
                    resource_type: 'image'
                });
                return result.secure_url;
            })
        );
        await Product.create({
            ...productData,
            images: imageUrls
        });
        res.json({
            success: true,
            message: "Product added successfully"
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.json({
            success: false,
            message: "Failed to add product",
            error: error.message
        });
    }
}
 
// Get all products : /api/product/list
export const productList = async (req, res) => {
    try{
        const products = await Product.find({});
        res.json({
            success: true,
            products: products
        });
    }catch(error){
        console.error("Error fetching products:", error);
        res.json({
            success: false,
            message: "Failed to fetch products",
            error: error.message
        });
    }
}

//Get single product : /api/product/:id
export const productById = async (req, res) => {
    try {
        const { _id } = req.body;
        const product = await Product.findById(_id);
        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }
        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.json({
            success: false,
            message: error.message || "Failed to fetch product",
        });
    }
}

// Change product instock : /api/product/stock
export const changeStock = async (req, res) => {
    try {
        const { productId, inStock } = req.body;
        const product = await Product.findByIdAndUpdate(productId, { inStock }, { new: true });
        if (!product) {
            return res.json({
                success: false,
                message: "Product not found"
            });
        }
        res.json({
            success: true,
            message: "Product stock updated successfully",
            product: product
        });
    } catch (error) {
        console.error("Error updating product stock:", error);
        res.json({
            success: false,
            message: error.message || "Failed to update product stock",
        });
    }
}