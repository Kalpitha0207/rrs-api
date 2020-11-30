const express = require('express');
const router = express.Router();

router.use('/admin', require('./admin'));
router.use('/user', require('./user'));
router.use('/reservation', require('./reservation'));

module.exports = router;