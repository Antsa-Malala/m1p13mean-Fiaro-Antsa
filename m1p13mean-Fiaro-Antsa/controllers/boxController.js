const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');
const boxService = require('../services/boxService');

const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

exports.createBox = async (req, res) => {
    try {
        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'boxes'
            });

            imageUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }

        const box = await boxService.createBox({
            ...req.body,
            image: imageUrl
        });

        res.status(201).json(box);
    } catch (err) {
        console.error("Error creating box:", err);
        res.status(400).json({ message: err.message });
    }
};

exports.getBoxes = async (req, res) => {
    try {
        const boxes = await boxService.getBoxes();
        res.json(boxes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBox = async (req, res) => {
    try {
        const box = await boxService.getBoxById(req.params.id);
        if (!box)
        {
            return res.status(404).json({ message: 'Box not found' });
        } 
        res.json(box);
    } catch (err) {
        res.status(500).json(
            {
                message: err.message 
            }
        );
    }
};

exports.updateBox = async (req, res) => {
    try {

        let updateData = {
            ...req.body
        };

        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'boxes'
            });

            imageUrl = result.secure_url;

            fs.unlinkSync(req.file.path);
        }

        if (req.file) {
            updateData.image = imageUrl;
        }

        const box = await boxService.updateBox(req.params.id, updateData);

        res.json(box);

    } catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

exports.deleteBox = async (req, res) => {
    try {
        await boxService.deleteBox(req.params.id);
        res.json(
            { 
                message: 'Box deleted' 
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
