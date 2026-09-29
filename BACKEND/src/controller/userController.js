const { getAuth, clerkClient } = require("@clerk/express");
const Booking = require("../models/booking.models");
const Movie = require("../models/movie.models");



//API controller to get user bookings
const getUserBookings = async (req, res) => {
  try {
    const { userId } = getAuth(req);
    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};


//API controller function to update Favorite Movies in Clerk User Metadata
const updateFavorite = async(req,res)=>{
    try {
        const {movieId} = req.body;
        const {userId} = getAuth(req);

        const user = await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favorites){
            user.privateMetadata.favorites = []
        }

        if(!user.privateMetadata.favorites.includes(movieId)){
            user.privateMetadata.favorites.push(movieId)
        }else{
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter((id)=>id !== movieId)
        }
        await clerkClient.users.updateUserMetadata(userId, {privateMetadata:user.privateMetadata})

        res.json({ success: true, message: "Favorite updated" })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

const getFavorites = async(req,res)=>{
    try {
        const {userId} = getAuth(req);
        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites || [];

        //Getting movie from database
        const movies = await Movie.find({ _id: { $in: favorites } })

        res.json({ success: true, movies })
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}


module.exports = { getUserBookings, updateFavorite, getFavorites };
