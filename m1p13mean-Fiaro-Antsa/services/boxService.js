const mongoose = require('mongoose');
const { Box } = require('../models/boxModel');

exports.createBox = async (data) => {
    try {
        const existing = await Box.findOne({ number: data.number, floor: data.floor, status: 'AVAILABLE' });
        if (existing) {
            throw new Error(`Box with number ${data.number} at floor ${data.floor} already exists`);
        }

        const box = await Box.create(data);
        console.log("Box created:", box);
        return box;

    } catch (err) {
        console.error("Error creating box:", err);
        throw err;
    }
};

exports.getBoxes = async () => {
    try {
        const boxes = await Box.find().populate('shop');
        return boxes;

    } catch (err) {
        console.error("Error getting boxes", err);
        throw err;
    }
};

exports.getBoxById = async (id) => {
    try {
        if (!id) throw new Error("Id parameter is required to get informations");

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid Box ID");
        }

        return await Box.findById(id).populate('shop');

    } catch (err) {
        console.error("Error getting box by id:", err);
        throw err;
    }
};

exports.updateBox = async (id, data) => {
    try {
        if (!id) throw new Error("Missing ID");

        if (!mongoose.Types.ObjectId.isValid(id))
            throw new Error("Invalid Box ID");

        const existingBox = await Box.findById(id);
        if (!existingBox) throw new Error("Box not found");

        if (data.shop && data.shop.toString() !== existingBox.shop?.toString()) {
            data.status = "OCCUPIED";
        }

        if (data.status === "AVAILABLE" || data.status === "MAINTENANCE") {
            data.shop = null;
        }

        return await Box.findByIdAndUpdate(id, data, { new: true });

    } catch (err) {
        console.error("Error updating box:", err);
        throw err;
    }
};

exports.deleteBox = async (id) => {
    try {
        if (!id) throw new Error("Id parameter is required to delete");

        if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid Box ID");

        return await Box.findByIdAndDelete(id);
    } catch (err) {
        console.error("Error updating box:", err);
        throw err;
    }
};