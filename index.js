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
const Player = require('./Classes/Player.js');
const playersModel = require('./back-end/routes/players');

const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = require('http').Server(app);
const io = require('socket.io')(httpServer);
mongoose.set('useFindAndModify', false);

if (!config.get('sessionSecret')) {
  console.log('FATAL sessionSecret IS MISSING');
  process.exit(1);
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
sessionMiddleware = session({
    secret: config.get('sessionSecret'),
    resave: true,
    saveUninitialized: true,
    name: "dungeonCrawler",
    // cookie: { secure: true },
});
app.use(sessionMiddleware);
app.use('/auth', authRoute);

// Temporary set up for socket-session connection
// const cookieParser = require('cookie-parser')();
// const passport = require('passport');
// const passInit = passport.initialize();
// const passSession = passport.session();
//
// io.use(function(socket, next) {
//   socket.client.request.originalUrl = socket.client.request.url;
//   sessionMiddleware(socket.client.request, socket.client.request.res, next);
// });
// io.use(function(socket, next) {
//   socket.client.request.originalUrl = socket.client.request.url;
//   cookieParser(socket.client.request, socket.client.request.res, next);
// });
// io.use(function(socket, next) {
//   passInit(socket.client.request, socket.client.request.res, next);
// });
// io.use(function(socket, next) {
//   passSession(socket.client.request, socket.client.request.res, next);
// });
//////
/*******/

/*** routes ***/
app.use('/auth', authRoute);
app.use('/player', playersModel);
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

/*** Socket.io TCP Connection (Chatbox & Unity) ***/
// Server side storage lists
var playersList = [];
var pSockets = [];
io.sockets.on('connection', function(socket) {
    console.log('Socket connection has been made');
    // Game Data (Unity)
    // let player = new Player(socket.request.session.name, socket.request.session.token);
    let player = new Player();
    let thisPlayerID = player.id;
    playersList[thisPlayerID] = player;
    pSockets[thisPlayerID] = socket;

    /* Events: server to client */
    socket.emit('register', {id: thisPlayerID}); // id to client
    socket.emit('spawn', player); // self to self
    socket.broadcast.emit('spawn', player); // self to others
    for (var playerID in playersList) {
      if (playerID != thisPlayerID) {
        socket.emit('spawn', playersList[playerID]); // others to self
      }
    }

    /* Events: client to server & back */
    // Chatbox
    socket.on('username', function(username) {
        socket.username = username;
        io.emit('is_online', '🟢 <i><b>' + socket.username + '</b> has joined the chat..</i>');
    });
    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });
    // Game
    socket.on('updatePosition', function(data) {
      player.position.x = data.position.x;
      player.position.y = data.position.y;
      socket.broadcast.emit('updatePosition', player);
    });
    // All
    socket.on('disconnect', function(username) {
      io.emit('is_online', '🔴 <i><b>' + socket.username + '</b> has left the chat..</i>');
      delete playersList[thisPlayerID];
      delete pSockets[thisPlayerID];
      socket.broadcast.emit('disconnected', player);
      console.log(socket.username+' has disconnected');
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
app.get('/game', auth, (req, res) => res.render("pages/game", { name: req.session.name}));
app.get('/chatbox', auth, (req, res) => res.render("pages/chatbox", { name: req.session.name}));
app.get('/revamp', auth, (req, res) => res.render("pages/main", { name: req.session.name}));
/*******/

module.exports = server;
