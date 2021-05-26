const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models/db.js');
const routes = require('./routes/routes.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helpers = require('./helpers/helpers.js');
var exphbs  = require('express-handlebars');
dotenv.config();

var dbURL = process.env.DB_URL;

db.connect();
const app = express();
const path = require('path');

app.use(bodyParser.urlencoded({extended:false}));

app.engine('.hbs',
            exphbs({
                extname: '.hbs', 
                partialsDir: __dirname + '/views/partials/',
                helpers: helpers
            }));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
    secret: 'Kappa123',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: dbURL}),
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24
    }
}));



port = process.env.PORT;
hostname = process.env.HOSTNAME;

app.use('/', routes);


// binding this to a specific port
app.listen(port, hostname, function(){
    console.log('Server running at:');
    console.log('http://' + hostname + ':' + port);
});