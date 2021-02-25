const mongoose = require('mongoose');
const Product = require('../models/Product');

const formatProduct = (product) => ({
    id: product._id,
    title: product.title,
    images: product.images,
    category: product.category._id,
    subcategory: product.subcategory._id,
    price: product.price,
    description: product.description
})

const formatProductList = (products) => ({
    products: products.map(formatProduct)
})

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
    const subcategory = ctx.request?.query?.subcategory;
    if (subcategory) {
        ctx.status = 200;
        ctx.body = formatProductList(await Product.find({ subcategory }))
    } else {
        await next();
    }
};

module.exports.productList = async function productList(ctx, next) {
    ctx.status = 200;
    ctx.body = formatProductList(await Product.find({}))
};

module.exports.productById = async function productById(ctx, next) {

    const productId = ctx.params?.id;

    if (productId) {
        if (mongoose.Types.ObjectId.isValid(productId)) {
            const product = await Product.findById(productId)
            if (product) {
                ctx.body = {
                    product: formatProduct(product)
                };
            } else {
                ctx.status = 404
            }
        } else {
            ctx.status = 400
        }
    }
};

