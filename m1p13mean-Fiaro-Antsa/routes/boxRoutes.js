const express = require('express');
const router = express.Router();
const boxController = require('../controllers/boxController');

const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', authMiddleware, authorize(['ADMIN']), boxController.getBoxes);       
router.post('/', authMiddleware, authorize(['ADMIN']), upload.single('image'), boxController.createBox);     
router.get('/:id', authMiddleware, authorize(['ADMIN','SHOP']), boxController.getBox);            
router.put('/:id', authMiddleware, authorize(['ADMIN']), upload.single('image'), boxController.updateBox);         
router.delete('/:id', authMiddleware, authorize(['ADMIN']), boxController.deleteBox);  

module.exports = router;    