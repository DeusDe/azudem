const dotenv = require('dotenv')
dotenv.config()
const http = require('http');
const https = require('https');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const fs = require('fs');
const tools = require('./src/tools/tools')

const session = require('express-session')
const passport = require('passport')


const indexRouter = require('./src/express/routes/index');
const usersRouter = require('./src/express/routes/users');
const channelRouter = require('./src/express/routes/channel');
const apiRouter = require('./src/express/routes/api');

const app = express();
/**
var server = https.createServer({
  key: fs.readFileSync('./src/ssl/RootCA.key'),
  cert: fs.readFileSync('./src/ssl/RootCA.crt')
}, app)
**/
// view engine setup
app.set('views', path.join(__dirname, 'src/express/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'src/express/public')));
app.use(express.static(path.join(__dirname, 'src/express/public')));
app.use(session({secret:tools.env.SESSION_SECRET,resave:false,saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/channel', channelRouter)
app.use('/api', apiRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

const Gatherer = require('./src/twitch/gatherer');


const gatherer = new Gatherer();
const channels = tools.channels.channels

for (const channel of channels) {
  setTimeout(async e => {
    await gatherer.getChannel(channel)
    gatherer.createLiveInfoInterval(channel,tools.conf.gatherer.info_delay * 1_000);
  }, 5000)
}
