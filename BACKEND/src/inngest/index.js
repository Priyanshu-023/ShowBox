const { Inngest } = require('inngest');
const User = require('../models/user.models');
const Show = require('../models/show.models');
const Booking = require('../models/booking.models');

// Create a client to send and receive events
const inngest = new Inngest({ id: "movie-ticket-booking" });

//Inngest function to save user data to database
const syncUserCreation = inngest.createFunction(
    { id: 'save-user', triggers: [{ event: 'clerk/user.created' }] },
    async ({ event })=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: [first_name, last_name].filter(Boolean).join(' '),
            image: image_url
        }
        await User.create(userData)
    }
)


//Inngest function to delete user data from database
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user', triggers: [{ event: 'clerk/user.deleted' }] },
    async ({ event })=>{
        const {id} = event.data
        await User.findByIdAndDelete(id)
    }
)

//Inngest function to update user data in database
const syncUserUpdate = inngest.createFunction({
    id: 'update-user',
    triggers: [{ event: 'clerk/user.updated' }]
},
    async ({ event })=>{
        const {id, first_name, last_name, email_addresses, image_url} = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: [first_name, last_name].filter(Boolean).join(' '),
            image: image_url
        }
        await User.findByIdAndUpdate(id,userData)
    }
)

//Inngest function to cancel bookings and release seats of show after 10 minutes of booking created if payment is not done 
const releaseSeats = inngest.createFunction(
    { id: 'release-seats', triggers: [{ event: 'app/checkpayment' }] },
    async ({event, step}) =>{
        const tenMinsLater = new Date(Date.now() + 10*60*1000)
        await step.sleepUntil('wait-for-10-mins' , tenMinsLater)
        await step.run('check-payment-status',async()=>{
            const {bookingId} = event.data
            const bookingData = await Booking.findById(bookingId)

            //If payment is not done then release the seats and delete the bookings
            if(!bookingData.isPaid){
                const showData = await Show.findById(bookingData.show)
                bookingData.bookedSeats.forEach((seat)=>{
                    delete showData.occupiedSeats[seat]
                })
                showData.markModified('occupiedSeats')
                await showData.save()
                await Booking.findByIdAndDelete(bookingId)
            }
        })
    }
)






// Inngest functions to be served
const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate, releaseSeats];

module.exports = { inngest, functions };

