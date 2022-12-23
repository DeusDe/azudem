const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require("passport");


const userShema = new mongoose.Schema({
    username: {type:String,required:true},
    admin:{type:Boolean,default:false}
});

userShema.plugin(passportLocalMongoose)

const userModel = mongoose.model('User', userShema);
passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())

const User = {
    Shema: userShema,
    Model: userModel,
};

exports.User = User;
