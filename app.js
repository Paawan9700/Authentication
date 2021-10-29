//jshint esversion:6
require('dotenv').config()
const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const ejs = require('ejs')
const session = require('express-session')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require("md5");
// const bcrypt = require('bcrypt');
// const saltRounds = 10;


app.use(BodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.use(session({
    secret: 'our little secrets',
    resave: false,
    saveUninitialized: true,
  }))

app.use(passport.initialize());
app.use(passport.session());



const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
    email : String, 
    password : String
})


userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/', (req, res) => {
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/secrets', (req, res) => {
    if(req.isAuthenticated()){
        res.render("secrets");
    } else {
        res.redirect('/login');
    }
})

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})

app.post("/register", (req, res) => {
    User.register({username : req.body.username}, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            res.redirect('/register');
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect('/secrets');
            })
        }
    })
});

app.post('/login', (req, res) => {
   const user = new User({
       username : req.body.username, 
       password : req.body.password
   })

   req.login(user, function(err){
       if(err){
           console.log(err);
       } else {
           passport.authenticate("local")(req, res, function(){
               res.redirect('secrets');
           })
       }
   })
})


const Port = process.env.PORT || 3000
app.listen(Port, () => {
    console.log(`listening at the port ${Port}...`);
});