const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require ('@clerk/express');
const { serve } = require('inngest/express');
const {inngest , functions} = require('./inngest/index.js');
const showRouter = require('./routes/showRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const adminRouter = require('./routes/adminRoutes.js');
const { stripeWebhooks } = require('./controller/stripeWebhooks.js');





const app = express();

//Stripe Webhooks Route (must come before express.json() — Stripe needs the raw body)
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

//Middlewares
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());


//Routes
app.get('/', (req, res) => {
    res.send('Server is live');
});

app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/show', showRouter)
app.use('/api/bookings',bookingRouter)
app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)






module.exports = app;