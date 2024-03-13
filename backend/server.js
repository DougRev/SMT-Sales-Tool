require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
require('./config/passportSetup');
const User = require('./models/User');
const cors = require('cors');
const clientRoutes = require('./routes/clients');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


// Middleware
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/api/clients', clientRoutes);


// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/current_user', (req, res) => {
    if (req.user) {
        res.json(req.user); // Assuming `req.user` holds the authenticated user's data
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});


app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home or to another page.
    res.redirect('http://localhost:3000/success'); // Change to your frontend URL
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port ${PORT}`));
