const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {

    const categories = await Category.find({});

    ctx.status = 200;
    ctx.body = {
        categories: categories.map((category) => ({
            id: category._id,
            title: category.title,
            subcategories: category.subcategories.map((subcategory) => ({
                id: subcategory._id,
                title: subcategory.title,
            }))
        }))
    };
};
