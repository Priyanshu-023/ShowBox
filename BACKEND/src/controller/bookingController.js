const Booking = require("../models/booking.models");
const Show = require("../models/show.models");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


const checkSeatAvailability = async(showId, selectedSeat)=>{
    try {
        const showData = await Show.findById(showId);
        const occupiedSeats = showData.occupiedSeats;
        const isAnySeatTaken = selectedSeat.some(seat=>occupiedSeats[seat]);
        return !isAnySeatTaken
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

const createBooking = async(req, res)=>{
    try {
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body;
        const {origin} = req.headers;

        //Check if the seats is available for the selected Show
        const isAvailable = await checkSeatAvailability(showId, selectedSeats);

        if(!isAvailable){
            return res.json({success:false , message: "Selected Seats are not available"});
        }

        //Get the Show Details
        const showData = await Show.findById(showId).populate('movie');

        //Create a new booking
        const booking = await Booking.create({
            user: userId,
            show:showId,
            amount: showData.showPrice*selectedSeats.length,
            bookedSeats:selectedSeats,
        })

        selectedSeats.forEach((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save()

        // Stripe Gateway Initialize 
        const session = await stripe.checkout.sessions.create({
            success_url : `${origin}/loading/mybookings`,
            cancel_url : `${origin}/mybookings`,
            line_items : [
                {
                    price_data : {
                        currency : 'usd',
                        product_data : {name : showData.movie.title},
                        unit_amount : Math.floor(booking.amount) * 100
                    },
                    quantity : 1
                }
            ],
            mode : 'payment',
            metadata : {
                bookingId : booking._id.toString()
            },
            expires_at : Math.floor(Date.now()/1000) + 30 * 60
        })

        booking.paymentLink = session.url
        await booking.save()

        //Run Inngest Sheduler Function to check payment status after 10 minutes

        await inngest.send({
            name: 'app/checkpayment',
            data: {bookingId : booking._id.toString()},
        })

        res.json({success: true, url: session.url})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

const getOccupiedSeats = async(req,res)=>{
    try {
        const {showId} =  req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats);

        res.json({success: true , occupiedSeats})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

module.exports = {createBooking , getOccupiedSeats}
