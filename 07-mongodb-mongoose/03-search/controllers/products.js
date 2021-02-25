const Product = require('../models/Product');

const formatProduct = (product) => ({
    id: product._id,
    title: product.title,
    images: product.images,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    description: product.description
})

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
    const query = ctx.request?.query?.query;
    if (query) {
        const products = await Product
            .find(
                { $text: { $search: query } },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: 'textScore' } })

        ctx.status = 200;
        ctx.body = { products: products.map(formatProduct) };
    }
};
