const express = require('express')
// const MongoClient = require('mongodb').MongoClient;
const axios = require('axios')

const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
// }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/signIn'));
app.get('/signin', (req, res) => res.render('pages/signIn'));
app.get('/signup', (req,res) => res.render('pages/register'));
// app.get('/demo', (req,res) => res.render('pages/demo'));

let token = "";

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
          .then(response => {
            console.log(response);
            console.log(`statusCode: ${response.status}, ${response.statusText}`);
            token = response.data;
            // request.session.loggedin = true;
            // request.session.username = username;
            res.render("pages/demo");
          })
          .catch(error => {
            console.error("ERROR:", error.response);
            // alert(error.response.data);         
            // res.status(401).end(error.response.data);
            res.redirect('/#error');
          });
        // this.setState({ users: data });
        // this.setState(axiosRes);
    // };
});

app.post('/register', (req, res) => {
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

    const respMsg = axios.post(register_uri, data)
      .then(response => {
        console.log(`statusCode: ${response.status}, ${response.statusText}`)
        // console.log(response);
        // respMsg = response;
        res.render("pages/demo");
      })
      .catch(error => {
        // console.error(error)
        console.error("ERROR:", error.response.data);
        res.status(401).end('Incorrect Email and/or Password! Please go back and sign up again.');
        // respMsg = error.response;
        // alert("ERROR:", error.response.data);
        //error.end(error);
      });

    console.log(respMsg.data);
    //res.status(401).end('Incorrect Email and/or Password! Please go back and sign up again.');
    //res.end();
    //res.redirect("/");
});


app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
