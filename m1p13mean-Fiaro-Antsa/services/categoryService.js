const mongoose = require('mongoose');
const { Category } = require('../models/categoryModel');

exports.createCategory = async (data) => {
    try {
        const existing = await Category.findOne({ name: data.name });
        if (existing) {
            throw new Error(`Category with name ${data.name} already exists`);
        }

        const category = await Category.create(data);
        console.log("Category created:", category);
        return category;

    } catch (err) {
        console.error("Error creating category:", err);
        throw err;
    }
};

exports.getCategories = async () => {
    try {
        return await Category.find();
    } catch (err) {
        console.error("Error getting categories", err);
        throw err;
    }
};

exports.getCategoryById = async (id) => {
    try {
        if (!id) throw new Error("Id parameter is required to get informations");

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Category ID");
        }

        return await Category.findById(id);

    } catch (err) {
        console.error("Error getting category by id:", err);
        throw err;
    }
};

exports.updateCategory = async (id, data) => {
    try {
        if (!id) throw new Error("Missing ID");

        if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error("Invalid Category ID");

        const existingCategory = await Category.findById(id);
        if (!existingCategory) throw new Error("Category not found");

        return await Category.findByIdAndUpdate(id, data, { new: true });

    } catch (err) {
        console.error("Error updating category:", err);
        throw err;
    }
};

exports.deleteCategory = async (id) => {
    try {
        if (!id) throw new Error("Id parameter is required to delete");

        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Category ID");

        return await Category.findByIdAndDelete(id);
    } catch (err) {
        console.error("Error updating category:", err);
        throw err;
    }
};