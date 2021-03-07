const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {

    const { product, phone, address } = ctx?.request?.body ?? {};

    let order = await Order.create({ product, phone, address, user: ctx.user._id });
    order = await order.populate('product').execPopulate()

    await sendMail({
        template: 'order-confirmation',
        locals: {
            id: order._id,
            product: {
                title: order.product.title
            }
        },
        to: 'user@mail.com',
        subject: 'Подтвердите почту',
    });

    ctx.statusCode = 200;
    ctx.body = { order: order._id }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {

    const orders = await Order.find({ user: ctx.user._id }).populate('product');
    ctx.statusCode = 200;

    ctx.body = {
        orders: orders.map(({ _id: id, user, phone, address, product }) => ({
            id,
            user,
            phone,
            address,
            product: {
                id: product._id,
                title: product.title,
                images: product.images,
                category: product.category,
                subcategory: product.subcategory,
                price: product.price,
                description: product.description,
            },
        }))
    }
};
