const express = require("express");
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex') lo
const register = require('./controllers/register')
const signin = require('./controllers/signIn')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
});


const app = express();

// Add middlewares here
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json())
app.use(cors())

// Listen ro port
app.listen(process.env.PORT || '3000', () => {
    console.log(`app is running on port ${process.env.PORT}`);
});

// Routes
app.get('/', (req, res) => {
    res.json(database.users)
})

app.post('/signin', (req, res) => {
    signin.handleSignin(req, res, db, bcrypt)
})

app.post('/register', (req, res) => {
    register.handleRegister(req, res, db, bcrypt)
})

app.get('/profile/:id', (req, res) => {
    profile.handleProfileGet(req, res, db);
})

app.put('/image', (req, res) => {
    image.handleImage(req, res, db)
})

// This endpoint was made to hide our api key if we used put to be hidden on the headers.
// Post hides all this data. 
app.post('/imageUrl', (req, res) => {
    image.handleApiCall(req, res)
})
