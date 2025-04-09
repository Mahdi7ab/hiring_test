const Save = require('../models/save');

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    console.log('Received data to save:', req.body);

    try {

        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save();
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};

exports.getGameData = async (req, res) => {
    try {
        const { userID, difficulty,completed } = req.body;
        console.log('Received data to query:', req.body);
        const query = {};
        if (userID) query.userID = userID;
        if (difficulty) query.difficulty = difficulty;
        if (completed) query.completed = completed;

        const results = await Save.find(query).sort({ gameDate: -1 });
        res.status(200).json(results);
    } catch (error) {
        console.error('Error retrieving game data:', error);
        res.status(500).json({ message: 'Error retrieving game data', error: error.message });
    }
};

exports.getGameDataByQueryParams = async (req, res) => {
    try {
        const { userID, difficulty,completed } = req.query;
        console.log('Received data to query:', req.query);
        const query = {};
        if (userID) query.userID = userID;
        if (difficulty) query.difficulty = difficulty;
        if (completed) query.completed = completed;

        const results = await Save.find(query).sort({ gameDate: -1 });
        res.status(200).json(results);
    } catch (error) {
        console.error('Error retrieving game data:', error);
        res.status(500).json({ message: 'Error retrieving game data', error: error.message });
    }
};