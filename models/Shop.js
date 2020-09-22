const mongoose = require('mongoose');
const arrayUniquePlugin = require('mongoose-unique-array');

const moment = require('moment');
const shopSchema = new mongoose.Schema({
	name: String,
	data: JSON,
	uninstalled: { type: Boolean, default: false },
	orders: [
		{
			_id: false,
			id: { type: Number, required: true, dropDups: true },
			phone: Number,
			vendor: String,
			name: String,
			url: String,
			dataTime: {
				type: String,
				default: moment().format()
			},
			price: Number,
			email: { type: String, default: null },
			purchase: { type: Boolean, default: false },
			storeTime: {
				type: String,
				default: moment().format()
			},
			f1: String,
			f2: String,
			f3: String,
			f4: String
		}
	],

	sms: Array,
	smsCount: Number,
	recharge: { type: Number, default: 10 },
	template: [
		{
			_id: false,
			topic: { type: String, required: true, dropDups: true },
			customer: String,
			admin: String
		}
	],
	abandanTemplate: [
		{
			_id: false,
			topic: { type: String, required: true, dropDups: true },
			template: String,
			time: String,
			status: Boolean
		}
	],
	//TODO check this clicked schema
	clicked: [
		{
			_id: false,
			checkoutId: { type: Number, required: true, dropDups: true },
			followUp: Array,
			converted: { type: Boolean, default: false },
			price: { type: Number, default: null }
		}
	]
});
shopSchema.plugin(arrayUniquePlugin);
// const Store = new mongoose.model('Store', shopSchema);
module.exports = mongoose.model('Store', shopSchema);
