const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const categoryService = require('../services/categoryService');

const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

exports.createCategory = async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'categories'
            });

            imageUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }

        const category = await categoryService.createCategory({
            ...req.body,
            image: imageUrl
        });

        res.status(201).json(category);
    } catch (err) {
        console.error("Error creating category:", err);
        res.status(400).json({ message: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCategory = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category)
        {
            return res.status(404).json({ message: 'Category not found' });
        } 
        res.json(category);
    } catch (err) {
        res.status(500).json(
            {
                message: err.message 
            }
        );
    }
};

exports.updateCategory = async (req, res) => {
    try {

        let updateData = {
            ...req.body
        };

        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'categories'
            });

            imageUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }

        if (req.file) {
            updateData.image = imageUrl;
        }

        const category = await categoryService.updateCategory(req.params.id, updateData);

        res.json(category);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        res.json(
            { 
                message: 'Category deleted' 
            }
        );
    } catch (err) {
        res.status(400).json(
            { 
                message: err.message 
            }
        );
    }
};
