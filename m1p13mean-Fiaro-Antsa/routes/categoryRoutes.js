const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', authMiddleware, categoryController.getCategories);       
router.post('/', authMiddleware, authorize(['ADMIN']), upload.single('image'), categoryController.createCategory);     
router.get('/:id', authMiddleware, categoryController.getCategory);            
router.put('/:id', authMiddleware, authorize(['ADMIN']), upload.single('image'), categoryController.updateCategory);         
router.delete('/:id', authMiddleware, authorize(['ADMIN']), categoryController.deleteCategory);  

module.exports = router;    