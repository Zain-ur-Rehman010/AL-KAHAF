const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST /api/v1/contact — public
router.post('/', contactController.submit);

module.exports = router;