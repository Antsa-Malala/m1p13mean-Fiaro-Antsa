const shopService = require('../services/shopService');

exports.createShop = async (req, res) => {
    try {
        const shop = await shopService.createShop(req.body);
        res.status(201).json(shop);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getShops = async (req, res) => {
    try {
        const shops = await shopService.getAllShops();
        res.json(shops);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getShop = async (req, res) => {
    try {
        const shop = await shopService.getShopById(req.params.id);
        if (!shop)
        {
            return res.status(404).json({ message: 'Shop not found' });
        } 
        res.json(shop);
    } catch (err) {
        res.status(500).json(
            {
                message: err.message 
            }
        );
    }
};

exports.updateShop = async (req, res) => {
    try {
        const shop = await shopService.updateShop(req.params.id, req.body);
        res.json(shop);
    } catch (err) {
        res.status(400).json(
            {
                message: err.message 
            }
        );
    }
};

exports.deleteShop = async (req, res) => {
    try {
        await shopService.deleteShop(req.params.id);
        res.json(
            { 
                message: 'Shop deleted' 
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

exports.login = async (req, res) => {
  try {
    const { name, password } = req.body;
    const result = await shopService.loginShop(name, password);

    if (!result) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', token: result.token, shop: result.shop });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
