const pursacheCustomerService = require('../services/purchaseCustomerService');

exports.createPurchaseCustomer = async (req, res) => {
    try {
        const pursache = pursacheCustomerService.addPurchaseCustomer(req.body);

        res.json(pursache);
    } catch (error) {
        console.error(error);

        res.status(400).json({ error: error.message });
    }
}