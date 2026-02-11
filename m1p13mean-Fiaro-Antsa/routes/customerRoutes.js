const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

// Route protégée : seul un customer connecté peut accéder
/*router.get('/protected', authMiddleware, );*/

router.get('/', authMiddleware, authorize(['ADMIN']), customerController.getCustomers);               
router.get('/:id', authMiddleware, customerController.getCustomer);            
router.put('/:id', authMiddleware, authorize(['ADMIN', 'CUSTOMER']), customerController.updateCustomer);         
router.delete('/:id', authMiddleware, authorize(['ADMIN']), customerController.deleteCustomer);      
router.post('/signup', customerController.createCustomer);     
router.post('/login', customerController.login);            

module.exports = router;