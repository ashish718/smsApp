require('dotenv').config();
const cron = require('node-cron');
const http = require('https');
const express = require('express');
const session = require('express-session');
const shortid = require('shortid');
const validUrl = require('valid-url');
const mongoose = require('mongoose');
const colors = require('colors');
const path = require('path');
const moment = require('moment');
const app = express();
const parseurl = require('parseurl');
const request = require('request-promise');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const mongoConnect = require('connect-mongo')(session);
const axios = require('axios');

require('newrelic');

const Store = require('./models/Shop');
const Url = require('./models/Url');
let {cronFunction} = require('./utils/cron')

const {connectDB} = require('./db/connectMongo');



//Db Connection
connectDB();

//Middleware Routes
app.use('/install', require('./routes/ShopifyInstallRoute'))
app.use('/s', require('./routes/UrlRoute'));
app.use('/webhook', require('./routes/webhookRoute'));
app.use('/api', require('./routes/SettingRoute'));

// get the url pathname

let pathname;

app.use(bodyParser.json());

app.use(
	bodyParser.urlencoded({
		extended: true
	})
);


app.use(
	session({
		secret: 'mylittleSecrets.',
		resave: false,
		saveUninitialized: false,
		store: new mongoConnect({
			mongooseConnection: mongoose.connection
		})
	})
);



app.use(function(req, res, next) {
	res.locals.session = req.session;
	next();
});

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

app.use(function(req, res, next) {
	if (!req.session.views) {
		req.session.views = {};
	}
	pathname = parseurl(req).pathname;
	// count the views
	req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
	next();
});


cron.schedule('*/2 * * * * ', async () => {
	//getting list of all store name
	console.log('!production cron started');

	cronFunction()

})




if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}


// app.post('/whatsapp', function(req, res) {
// 	res.sendStatus(200);
// 	console.log(req.body, 'whatsapp response');
// });
// app.post('/whatsapp/reply', function(req, res) {
// 	res.sendStatus(200);
// 	console.log(req.body, 'whatsapp reply response');
// });


const port = process.env.PORT || 4000;
app.listen(port, () => {
	console.log(`app listening on port ${port}!`);
});
