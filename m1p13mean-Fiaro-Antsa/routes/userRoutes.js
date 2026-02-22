const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.post('/signup', userController.createUser);     
router.get('/users/:role', authMiddleware, authorize(['ADMIN']), userController.getUsersByRole);               
router.get('/:id', authMiddleware, userController.getUser);            
router.put('/:id', authMiddleware, userController.updateUser);         
router.delete('/:id', authMiddleware, authorize(['ADMIN']), userController.deleteUser);      
router.post('/login', userController.login);    

module.exports = router;    