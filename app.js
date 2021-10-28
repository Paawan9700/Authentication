//jshint esversion:6
require('dotenv').config()
const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const ejs = require('ejs')
const encrypt = require('mongoose-encryption');

app.use(BodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')


const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
    email : {
        type : String, 
        required : true
    },
    password : {
        type : String, 
        required : true
    },
})


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});
const User = new mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
})


app.get('/register', (req, res) => {
    res.render('register');
})

app.post("/register", (req, res) => {
    // console.log(req.body)
    const newUser = new User({
        email : req.body.username, 
        password : req.body.password
    });

    newUser.save((err) => {
        if(err)
            console.log(err);
        else
            res.render('secrets');
    })
})

app.post('/login', (req, res) => {
    User.findOne({email : req.body.username}, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === req.body.password){
                    res.render('secrets');
                }
            } else {
                console.log('type valid credentials');
            }
        }
    })
})


const Port = process.env.PORT || 3000
app.listen(Port, () => {
    console.log(`listening at the port ${Port}...`);
});