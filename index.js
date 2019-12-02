/*** Variables & System Settings ***/
const express = require('express')
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const axios = require('axios');
const config = require('config');
const socketIO = require('socket.io');
const http = require('http');
const passportSetup = require('./back-end/oauthStrategy/passport-google-strategy');
const authRoute = require('./back-end/routes/auth');
const players = require('./back-end/routes/players');

const PORT = process.env.PORT || 8080;
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
mongoose.set('useFindAndModify', false);

if (!config.get('sessionSecret')) {
  console.log('FATAL sessionSecret IS MISSING');
  process.exit(1);
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: config.get('sessionSecret'),
    resave: true,
    saveUninitialized: true,
    name: "dungeonCrawler",
    // cookie: { secure: true },
}));
/*******/

/*** routes ***/
app.use('/auth', authRoute);
app.use('/player', players);
/******/

/*** Server Connection ***/
const server = httpServer.listen(PORT, () => console.log(`Listening on ${ PORT }...`));
/*******/

/*** MongoDB Connections ***/
if (process.env.NODE_ENV === 'development') {
  const db = config.get('db');
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log(`Connected to MongoDB...`);
    })
    .catch(err => {
      console.log('Could not connect to MongoDB', err);
    });
}

if (process.env.NODE_ENV === 'remote') {
  const db = config.get('db_local');
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log(`Connected to MongoDB ${db}...`);
    })
    .catch(err => {
      console.log('Could not connect to MongoDB', err);
    });
}

if (process.env.NODE_ENV === 'test') {
  const db = config.get('db_test');
  mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
      console.log(`Connected to ${db}...`);
    })
    .catch(err => {
      console.log('Could not connect to MongoDB', err);
    });
}
/*******/

/*** Socket.io TCP Connection (Chatbox) ***/
io.sockets.on('connection', function(socket) {
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🔵 <i>' + socket.username + ' has joined the chat..</i>');
    });
    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + socket.username + ' has left the chat..</i>');
    });
    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });
});
/*******/

/*** Authentication & Authorization Middleware ***/
const auth = function(req, res, next) {
    if (req.session && req.session.loggedin && req.session.email) return next();
    else return res.status(401).send("Unauthorized. Please log in and try again.");;
};

const loggedInAlert = function(req, res, next) {
    // console.log(req.session);
    if (req.session.loggedin) return res.send("Already logged-in. Please logout first or return back home.");
    else return next();
};
/*******/

/*** Views Rendering ***/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    if (req.session.loggedin) res.redirect('demo');
    else res.redirect('/signin');
});
app.get('/signin', loggedInAlert, (req, res) => res.render('pages/signIn'));
app.get('/signup', loggedInAlert, (req,res) => res.render('pages/register'));
app.get('/logout', function (req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/signin');
});
app.get('/demo', auth, (req, res) => res.render("pages/demo", { name: req.session.name}));
app.get('/game', auth, (req, res) => res.render("pages/demo", { name: req.session.name}));
app.get('/chatbox', auth, (req, res) => res.render("pages/chatbox", { name: req.session.name}));
/*******/

module.exports = server;
