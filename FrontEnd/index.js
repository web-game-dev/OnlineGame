const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const axios = require('axios')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));


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
app.get('/demo', (req,res) => res.render('pages/demo'));

var token = "";

// app.post('/login', (req, res) => {
//     const register_uri = "https://dungeon-crawler-back-end.herokuapp.com/auth/login"; 
    
//     // var name = req.body.username;
//     var email = req.body.email;
//     var pw = req.body.password;

//     var data = {
//         // "name": name,
//         "email": email,
//         "password": pw, 
//     }
    
//     // console.log("DATA is " + JSON.stringify(data));
    
//     // respMsg = () => {
//         // let axiosRes = await axios.get(register_uri, data)
//         // let axiosRes = axios.post(register_uri, data)
//     const respMsg = axios.post(register_uri, data)
//           .then(response => {
//             console.log(`statusCode: ${response.status}, ${response.statusText}`)
//             // console.log(response);
//             // respMsg = response;
//             // request.session.loggedin = true;
//             // request.session.username = username;
//             res.redirect("/demo");    
//           })
//           .catch(error => {
//             console.error("ERROR:", error.response.data);
//             // respMsg = error.response;
//             // alert("ERROR:", error.response.data);
//             res.end(error.response);       
//           });
//         // console.log(axiosRes.data)
//         // let { data } = axiosRes.data;
//         // this.setState({ users: data });
//         // this.setState(axiosRes);
//     // };

//     console.log(typeof respMsg);
// });

// app.post('/register', (req, res) => {
//     const register_uri = "https://dungeon-crawler-back-end.herokuapp.com/auth/register"; 
    
//     var name = req.body.username;
//     var email = req.body.email;
//     var pw = req.body.password;

//     var data = {
//         "name": name,
//         "email": email,
//         "password": pw, 
//     }
    
//     // console.log("DATA is " + JSON.stringify(data));

//     const respMsg = axios.post(register_uri, data)
//       .then(response => {
//         console.log(`statusCode: ${response.status}, ${response.statusText}`)
//         // console.log(response);
//         // respMsg = response;
//         res.redirect("/demo");
//       })
//       .catch(error => {
//         // console.error(error)
//         console.error("ERROR:", error.response.data);
//         // respMsg = error.response;
//         // alert("ERROR:", error.response.data);
//         error.end(error);
//       });

//     console.log(respMsg.data);
//     res.end();
//     // res.redirect("/demo");
// });