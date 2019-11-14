const express = require('express')
const session = require('express-session');
const path = require('path')
// const MongoClient = require('mongodb').MongoClient;
const axios = require('axios')

/*** Variable & Express Settings ***/
const PORT = process.env.PORT || 5000
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true },
    loggedin: false
}));
// let token = "";
/*******/

/*** Views Rendering ***/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.send('Welcome back, ' + req.session.email + '!');
        res.render("pages/demo");
    } else {
        res.send('Please login to view this page!');
        res.render('pages/signIn')
    }
    res.end();
});
app.get('/signin', (req, res) => res.render('pages/signIn'));
app.get('/signup', (req,res) => res.render('pages/register'));
// app.get('/demo', (req,res) => res.render('pages/demo'));
/*******/

/*** POST Requests ***/
// Login
app.post('/login', async (req, res) => {
    const login_uri = "https://dungeon-crawler-back-end.herokuapp.com/auth/login";
    // const name = req.body.username;
    const email = req.body.email;
    const pw = req.body.password;
    const data = {
        // "name": name,
        "email": email,
        "password": pw,
    }
    // console.log("DATA is " + JSON.stringify(data));

    await axios.post(login_uri, data)
          .then(axiosResp => {
            console.log(axiosResp);
            console.log(`statusCode: ${axiosResp.status}, ${axiosResp.statusText}`);
            req.session.loggedin = true;
            req.session.secret = axiosResp.data;
            req.session.email = email;
            res.render("pages/demo");
          })
          .catch(error => {
            console.error("ERROR:", error.response);
            // alert(error.response.data);         
            res.status(401).send(error.response.data);
            // res.redirect('/#error');
          });
});

// Registration
app.post('/register', async (req, res) => {
    const register_uri = "https://dungeon-crawler-back-end.herokuapp.com/auth/register";
    const name = req.body.username;
    const email = req.body.email;
    const pw = req.body.password;
    const data = {
        "name": name,
        "email": email,
        "password": pw,
    }
    // console.log("DATA is " + JSON.stringify(data));

    await axios.post(register_uri, data)
      .then(axiosResp => {
        console.log(axiosResp);
        console.log(`statusCode: ${axiosResp.status}, ${axiosResp.statusText}`);
        req.session.loggedin = true;
        req.session.secret = axiosResp.data;
        req.session.username = name;
        req.session.email = email;
        res.render("pages/demo");
      })
      .catch(error => {
        // console.error(error)
        console.error("ERROR:", error.response);
        // alert("ERROR:", error.response.data);
        res.status(401).end(error.response.data);
        // res.redirect('/signup/#error');
      });
});
/*******/

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
