const movementStockService = require('../services/movementStockService');

exports.addMovementStock = async (req, res) => {
    try {
        const addedMovementStock = await movementStockService.addStock({
            ...req.body
        });

        res.status(201).json(addedMovementStock);
    } catch(error) {
        res.status(400).json({ message: error.message });
    }
}