// const sequelize = require('../config/database')
const Product = require('../models/Product');
const { Op } = require('sequelize');

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

    getProductById = async (productId) => {
        try {
            const product = await Product.findByPk(productId);
            return product;
        } catch (error) {
            console.error('Error fetching product by ID:', error);
        }
    };


    getProductByFilter = async (keySearch, categoryId, minPrice, maxPrice) => {
        try {
            
            // Xây dựng các điều kiện query
            let whereCondition = {};

            if (keySearch) {
                whereCondition.name = { [Op.like]: `%${keySearch}%` };
            }

            if (categoryId !== -1) {
                whereCondition.id_category = categoryId;
            }

            whereCondition.price = { [Op.between]: [minPrice, maxPrice] };

            const products = await Product.findAll({ where: whereCondition });

            return products;

        } catch (error) {
            console.error('Error filtered products:', error);
        }
    };
}

module.exports = new ProductService();