//jshint esversion:6
require('dotenv').config()
const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const ejs = require('ejs')
// const encrypt = require('mongoose-encryption');
// const md5 = require("md5");
const bcrypt = require('bcrypt');
const saltRounds = 10;


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
    
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email : req.body.username, 
            password : hash
        });
    
        newUser.save((err) => {
            if(err)
                console.log(err);
            else
                res.render('secrets');
        })
    });

})

app.post('/login', (req, res) => {
    User.findOne({email : req.body.username}, (err, foundUser) => {
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                    // result == true
                    if(result === true){
                        res.render('secrets');
                    }
                });
            }
        }
    })
})


const Port = process.env.PORT || 3000
app.listen(Port, () => {
    console.log(`listening at the port ${Port}...`);
});