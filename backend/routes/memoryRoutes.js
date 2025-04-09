const express = require('express');
const { saveGameData,getGameData,getGameDataByQueryParams } = require('../controllers/memoryController');
const router = express.Router();

// Route to save game data
router.post('/save', saveGameData);
router.post('/history', getGameData);
router.get('/history', getGameDataByQueryParams);
module.exports = router;
