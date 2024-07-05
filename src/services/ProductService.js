// const sequelize = require('../config/database')
const { Product, Unit } = require('../models/index');
const { Op } = require('sequelize');
const asyncErrorWrapper = require('../Utils/AsyncErrorWrapper');


//[GET] /api/product
exports.getAllProduct = asyncErrorWrapper(async () => {
    const products = await Product.findAll({
        include: [{
            model: Unit,
            as: 'unit'
        }],
        attributes: { exclude: ['id_unit'] } //remove id_unit from Product
    });
    return products;
});

//[GET] /api/product/newest
// get 20 newest products
exports.getNewestProduct = asyncErrorWrapper(async () => {
    const products = await Product.findAll({
        include: [{
            model: Unit,
            as: 'unit'
        }],
        attributes: { exclude: ['id_unit'] },
        limit: 20,
        order: [['id', 'DESC']]
    });
    return products;
});


//[GET] /api/product/top-discounted
// get top 20 discounted products
exports.getTopDiscountedProducts = asyncErrorWrapper(async () => {
    const products = await Product.findAll({
        include: [{
            model: Unit,
            as: 'unit'
        }],
        attributes: { exclude: ['id_unit'] },
        limit: 20,
        order: [['discount_percent', 'DESC']] // sort desc
    });
    return products;
});

//[GET] /api/product/discounted
// get all discounted products
exports.getAllDiscountedProducts = asyncErrorWrapper(async () => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Unit,
                as: 'unit'
            }],
            attributes: { exclude: ['id_unit'] },
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
});

exports.getProductById = asyncErrorWrapper(async (productId) => {
    const product = await Product.findByPk(productId, {
        include: [{
            model: Unit,
            as: 'unit'
        }],
        attributes: { exclude: ['id_unit'] },
    });
    return product;
});


exports.getProductByFilter = asyncErrorWrapper(async (keySearch, categoryId, minPrice, maxPrice) => {
    // Xây dựng các điều kiện query
    let whereCondition = {};

    if (keySearch) {
        whereCondition.name = { [Op.like]: `%${keySearch}%` };
    }

    if (categoryId !== -1) {
        whereCondition.id_category = categoryId;
    }

    whereCondition.price = { [Op.between]: [minPrice, maxPrice] };

    const products = await Product.findAll({
        where: whereCondition,
        include: [{
            model: Unit,
            as: 'unit'
        }],
        attributes: { exclude: ['id_unit'] },
    });

    return products;
});
