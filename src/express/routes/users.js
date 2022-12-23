var express = require('express');
var router = express.Router();
const DB = require("../../db/db");
const tools = require("../../tools/tools");
const db = new DB(`${tools.env.MONGODB_URI}/${tools.conf.database.stats_database}?retryWrites=true&w=majority`);
const passport = require('passport')
const {User: user} = require("../../db/Shemas/www/userShema");

const DiscordBot = require('../../discord/discord');
const TwitchBot = require('../../twitch/irc/irc');
const TwitchApi = require('../../twitch/api/api')

const discordBot = new DiscordBot(tools.env.DISCORD_TOKEN, new TwitchApi(tools.env.TWITCH_CLIENT_ID, tools.env.TWITCH_CLIENT_SECRET));
const twitchBot = new TwitchBot(tools.conf.tmi)


/* GET users listing. */
router.get('/', function (req, res, next) {
    if(req.isAuthenticated()){
        console.log(req.user)
        res.render("user")
    }else{
        res.redirect("users/login")
    }
});

router.get("/login",function (req, res, next){
    res.render('login')
})
    .post("/login",async function (req, res, next){
    const username = req.body.username;
    const password = req.body.password;

    const User = new user.Model({
        username,
        password
    })

    req.login(User,function (err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function () {
                res.redirect("/users")
            })
        }
    })

})

router.get("/register",function (req, res, next){
    res.render('register')
})
    .post("/register",async function (req, res, next){
    const username = req.body.username;
    const password = req.body.password;

    user.Model.register({username},password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/users")
            })
        }
    })
})


router.get("/logout",async function(req,res,next){
    req.logout( function(err){
        if(err){
            console.log(err)
        }
        res.redirect("/");
    });

})

module.exports = router;
