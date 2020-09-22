require('dotenv').config();
const colors = require('colors');

const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true
		});
		console.log('connected Mongo'.yellow.bold);
	} catch (error) {
		console.error(error);
	}
};

module.exports.connectDB = connectDB;
