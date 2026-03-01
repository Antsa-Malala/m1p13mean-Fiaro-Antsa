const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', authMiddleware, authorize(['ADMIN','SHOP','CUSTOMER']), productController.getProducts);
router.get('/min', authMiddleware, authorize(['ADMIN','SHOP','CUSTOMER']), productController.getProductsMinima);
router.get('/available/:shopId/:categoryId', authMiddleware, authorize(['ADMIN']), productController.getAvailableProducts);
router.post('/', authMiddleware, authorize(['ADMIN','SHOP']), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'variantImages', maxCount: 10 }]), productController.createProduct);
router.get('/:id', authMiddleware, authorize(['ADMIN','SHOP','CUSTOMER']), productController.getProductById);
router.put('/:id', authMiddleware, authorize(['ADMIN','SHOP']), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'variantImages', maxCount: 10 }]), productController.updateProduct);
router.delete("/variant/:productId/:variantId", authMiddleware, authorize(['ADMIN','SHOP']), productController.deleteVariant);
router.delete('/:id', authMiddleware, authorize(['ADMIN','SHOP']), productController.deleteProduct);
router.put('/:productId/variants/:variantId/stock', authMiddleware, authorize(['ADMIN','SHOP']), productController.updateVariantStock);

module.exports = router;