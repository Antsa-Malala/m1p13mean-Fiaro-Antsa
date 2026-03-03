const express = require('express');
const router = express.Router();
const dashBoardController = require('../controllers/dashBoardController');

const authMiddleware = require('../middlewares/authMiddleware');
const authorize = require('../middlewares/authorize');

router.get('/', authMiddleware, authorize(['ADMIN']), dashBoardController.getAllNeededInformation);

module.exports = router;