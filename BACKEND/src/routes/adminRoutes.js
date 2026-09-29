const express = require('express');
const { isAdmin, getDashboardData, getAllShows, getAllBookings } = require('../controller/adminController');
const protectAdmin = require('../../middleware/auth');


const adminRouter = express.Router();


adminRouter.get('/isAdmin',protectAdmin,isAdmin);
adminRouter.get('/dashboard',protectAdmin,getDashboardData);
adminRouter.get('/all-shows',protectAdmin,getAllShows);
adminRouter.get('/all-bookings',protectAdmin,getAllBookings);

module.exports = adminRouter;