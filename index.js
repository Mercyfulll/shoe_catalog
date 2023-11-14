import express from "express";
import {engine} from "express-handlebars";
import pgPromise from "pg-promise";
import flash from "express-flash";
import session from "express-session";
import bodyParser from "body-parser";
import routes from "./route/routes.js";

const app = express()
const pgp = pgPromise();


const connectionString = process.env.DATABASE_URL || 'postgres://nkndnlfv:v1L6kH69CUXaXSjXIBfO-82KUL3gOQ-c@tyke.db.elephantsql.com/nkndnlfv'

const db = pgp(connectionString)

const route = routes(db)

// use the express.static built-in middleware to serve static file 'css'
app.use(express.static('public'))
//use session to maintain data on the application
app.use(session({
    secret : 'This is a string',
    resave: false,
    saveUninitialized: true
}));

// Middleware to add cart to every request
app.use((req, res, next) => {
    if (!req.session.cart) {
        req.session.cart = [];
    }
    next();
});


// Middleware to check if the user is logged in
const requireLogin = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};
app.use(flash());

// set and callback engine 
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/',route.home)
app.get('/shoes/shoe/:shoe',route.shoeSpecs)
app.get('/login',function (req,res){
    res.render('login')
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        req.session.userId = user.id;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});
app.get('/signup',function (req,res){
    res.render('signup')
})
app.get('/shoes/gender/Men',route.maleShoes)
app.get('/shoes/gender/Women',route.femaleShoes)

app.post('/shoes/shoe/:shoe',route.shoeSpecs)
app.post('/shoes/filter',route.filterAll)
app.post('/addToCart/:itemId', (req, res) => {
    const itemId = req.params.itemId;
    const item = route.getShoesById(itemId);
    if (item) {

        req.session.cart.push(item);

    }
    res.redirect('/');
});

const PORT = process.env.PORT || 3001

app.listen(PORT, function(){
    console.log('🚀 App has started on', PORT)
})