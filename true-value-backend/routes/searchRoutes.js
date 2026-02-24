const express = require('express');
const router = express.Router();
const {
    performFacetedSearch,
    getAutocomplete
} = require('../controllers/searchController');

router.get('/', performFacetedSearch);
router.get('/autocomplete', getAutocomplete);

module.exports = router;
