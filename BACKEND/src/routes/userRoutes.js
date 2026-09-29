const express = require('express');
const { getUserBookings, updateFavorite, getFavorites } = require('../controller/userController');


const userRouter = express.Router();


userRouter.get('/bookings',getUserBookings)
userRouter.post('/update-favorites',updateFavorite)
userRouter.get('/favorites',getFavorites)


module.exports = userRouter;