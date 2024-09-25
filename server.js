const express = require('express');
const passport = require('passport');
const session = require('express-session');
require('dotenv').config();
require('./passport-setup');  // Import passport setup

const app = express();

// Set up session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialize Passport and session handling
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
});

// Google OAuth route
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful login
        res.redirect('/dashboard');
    }
);

// Protected route (only accessible after login)
app.get('/dashboard', isLoggedIn, (req, res) => {
    res.send(`<h1>Dashboard</h1><p>Welcome, ${req.user.name}</p><a href="/logout">Logout</a>`);
});

// Logout route
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
