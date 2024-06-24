// const sequelize = require('../config/database')
const Product = require('../models/Product');


class ProductService {
    //[GET] /api/product
    getAllProduct = async () => {
        try {
            const products = await Product.findAll();
            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    //[GET] /api/product/newest
    // get 20 newest products
    getNewestProduct = async () => {
        try {
            const products = await Product.findAll({
                limit: 20,
                order: [['id', 'DESC']]
            });
            return products;
        } catch (error) {
            console.error('Error fetching newest products:', error);
        }
    };


    //[GET] /api/product/top-discounted
    // get top 20 discounted products
    getTopDiscountedProducts = async () => {
        try {
            const products = await Product.findAll({
                limit: 20,
                order: [['discount_percent', 'DESC']] // sort desc
            });
            return products;
        } catch (error) {
            console.error('Error fetching newest products:', error);
        }
    };

    //[GET] /api/product/discounted
    // get all discounted products
    getAllDiscountedProducts = async () => {
        try {
            const products = await Product.findAll({
                where: {
                    discount_percent: {
                        [Op.gt]: 0, // Lọc sản phẩm có discount_percent > 0
                    }
                },
                order: [['discount_percent', 'DESC']] //sort desc
            });
            return products;
        } catch (error) {
            console.error('Error fetching newest products:', error);
        }
    };
}

module.exports = new ProductService();