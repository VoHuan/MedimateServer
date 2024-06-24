const ProductService = require('../services/ProductService')

class ProductController{

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


    
}
module.exports = new ProductController();