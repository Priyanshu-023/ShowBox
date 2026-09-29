const express = require('express');
const showController = require('../controller/showController.js');
const protectAdmin = require('../../middleware/auth.js');
const showRouter = express.Router();


showRouter.get('/now-playing',protectAdmin, showController.getNowPlayingMovies);
showRouter.post('/add-show', protectAdmin, showController.addShow);
showRouter.get('/all',showController.getShows);
showRouter.get('/:movieId',showController.getShow)

module.exports = showRouter;
