const User = require("../models/user.models");
const Booking = require("../models/booking.models");
const Show = require("../models/show.models");



//API to check if user is admin
const isAdmin = async(req,res)=>{
    res.json({success:true, isAdmin:true})
}

//API to get dashboard data 
const getDashboardData = async(req,res)=>{
    try {
        const booking = await Booking.find({isPaid:true});
        const totalAmount = booking.reduce((total,booking)=>
            total + booking.amount,0)
        const activeShows = await Show.find({showDateTime:{$gte:Date.now()}}).populate('movie');
        const totalUser = await User.countDocuments();
        const dashboardData = {
            totalBookings : booking.length,
            totalRevenue : totalAmount,
            activeShows ,
            totalUser
        }
        res.json({success:true,dashboardData})

    } catch (error) {
        console.error(error);
        res.json({success:false, message:error.message})
    }
}

//API to get all shows 
const getAllShows = async(req,res)=>{
    try {
        const shows = await Show.find({showDateTime:{$gte:new Date()}}).populate('movie').sort({showDateTime:1});
        res.json({success:true , shows});
    } catch (error) {
        console.error(error);
        res.json({success:false, message:error.message})
    }
}

//ApI to get all bookings
const getAllBookings = async(req,res)=>{
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path:"show",
            populate:{path:"movie"}
        }).sort({createdAt:-1});
        res.json({success:true, bookings});
    } catch (error) {
        console.error(error);
        res.json({success:false, message:error.message})
    }
}

module.exports = { isAdmin, getDashboardData, getAllShows, getAllBookings }