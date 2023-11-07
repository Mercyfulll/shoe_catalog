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
app.post('/shoes/brand/:brandname',route.filterBrand)
app.post('/shoes/size/:size',route.filterSize)
app.post('/shoes/brand/:brandname/size/:size',route.filterBrandSize)

const PORT = process.env.PORT || 3001

app.listen(PORT, function(){
    console.log('🚀 App has started on', PORT)
})