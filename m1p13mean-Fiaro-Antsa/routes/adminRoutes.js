const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

// Route protégée : seul un admin connecté peut accéder
/*router.get('/protected', authMiddleware, );*/

router.get('/', authMiddleware, authorize(['ADMIN']), adminController.getAdmins);               
router.get('/:id', authMiddleware, authorize(['ADMIN']) , adminController.getAdmin);            
router.put('/:id', authMiddleware, authorize(['ADMIN']), adminController.updateAdmin);         
router.delete('/:id', authMiddleware, authorize(['ADMIN']), adminController.deleteAdmin);      
router.post('/signup', adminController.createAdmin);     
router.post('/login', adminController.login);            

module.exports = router;