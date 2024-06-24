const ProductService = require('../services/ProductService')

class ProductController{

    //[GET] /api/product
    getAllProduct = async (req, res, next) =>{
        try {
            const products = await ProductService.getAllProduct();
            res.status(200).json({
                message : 'Ok',
                data: products
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message : 'Internal Server Error',
                data: null
            })
            next(error);
        }
    };

    //[GET] /api/product/newest
    // get 20 newest products
    getNewestProduct = async (req, res, next) =>{
        try {
            const products = await ProductService.getNewestProduct();
            res.status(200).json({
                message : 'Ok',
                data: products
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message : 'Internal Server Error',
                data: null
            })
            next(error);
        }
    };

    //[GET] /api/product/top-discounted
     // get 20 top discounted products
     getTopDiscountedProducts = async (req, res, next) =>{
        try {
            const products = await ProductService.getTopDiscountedProducts();
            res.status(200).json({
                message : 'Ok',
                data: products
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message : 'Internal Server Error',
                data: null
            })
            next(error);
        }
    };

    //[GET] /api/product/discounted
    // get all discounted products
    getAllDiscountedProducts  = async (req, res, next) => {
        try {
            const products = await ProductService.getTopDiscountedProducts();
            res.status(200).json({
                message : 'Ok',
                data: products
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message : 'Internal Server Error',
                data: null
            })
            next(error);
        }
    };


    //[GET] /api/product/:id
    getProductById  = async (req, res, next) => {
        const productId = req.params.id;
        try {
            const product = await ProductService.getProductById(productId);
            if(!product){
                return res.status(404).json({ 
                    message : 'Product not found',
                    data: null
                });
            }
            res.status(200).json({
                message : 'Ok',
                data: product
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({
                message : 'Internal Server Error',
                data: null
            })
            next(error);
        }
    };

    
}
module.exports = new ProductController();