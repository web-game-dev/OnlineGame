const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/signIn'));
app.get('/signin', (req, res) => res.render('pages/signIn'));
app.get('/signup', (req,res) => res.render('pages/register'));
app.get('/demo', (req,res) => res.render('pages/demo'));

app.post('/login', (req, res) => {
    const register_uri = "https://dungeon-crawler-back-end.herokuapp.com/auth/login"; 
    
    var name = req.body.username;
    var email = req.body.email;
    var pw = req.body.password;

    var data = {
        "name": name,
        "email": email,
        "password": pw, 
    }
    
    // console.log("DATA is " + JSON.stringify(data));
    
    axios.post(register_uri, data)
      .then(res => {
        console.log(`statusCode: ${res.status}, ${res.statusText}`)
        // console.log(res)
      })
      .catch(error => {
        console.error(error)
      });

    token = res.data;
    console.log(token);
    if (!res.isAxiosError) res.redirect("/demo");
});

app.post('/register', (req, res) => {
    const register_uri = "https://dungeon-crawler-back-end.herokuapp.com/auth/register"; 
    
    var name = req.body.username
    var email = req.body.email;
    var pw = req.body.password;

    var data = {
        "name": name,
        "email": email,
        "password": pw, 
    }
    
    // console.log("DATA is " + JSON.stringify(data));
    
    axios.post(register_uri, data)
      .then(res => {
        console.log(`statusCode: ${res.status}, ${res.statusText}`)
        console.log(res)
      })
      .catch(error => {
        console.error(error)
      });

    token = res.data;
    console.log(token);
    if (!res.isAxiosError) res.redirect("/demo");
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
