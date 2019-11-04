const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('pages/signIn'));
app.get('/signup', (req,res) => res.render('pages/register'));
app.get('/demo', (req,res) => res.render('pages/demo'));

// app.get('/registerDone', (req,res) => res.redirect('/'));

app.post('/register', (req, res) => {
	var name = req.body.username
	var email = req.body.email;
	var pw = req.body.password;
	console.log(email, pw);
	res.send(`Hello, ${name}. Email: ${email}. PW: ${pw}.`);
});

// app.send("signupAction", (req,res) => req.body.email, req.body.password);

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
