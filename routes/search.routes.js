const { Router } = require('express');
const searchController = require('../controllers/search.controller');

const router = Router();

router.get('/:collection/:term', searchController)

module.exports = router;