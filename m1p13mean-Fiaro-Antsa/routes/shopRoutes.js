const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

// Route protégée : seul un shop connecté peut accéder
/*router.get('/protected', authMiddleware, );*/

router.get('/', authMiddleware, authorize(['ADMIN']), shopController.getShops);               
router.get('/:id', authMiddleware , shopController.getShop);            
router.put('/:id', authMiddleware, authorize(['ADMIN', 'SHOP']), shopController.updateShop);         
router.delete('/:id', authMiddleware, authorize(['ADMIN']), shopController.deleteShop);      
router.post('/signup', shopController.createShop);     
router.post('/login', shopController.login);            

module.exports = router;