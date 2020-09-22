
const Store = require('../models/Shop');
let {sendSms} = require('./utils/sms')

const shorten = async (params) => {
	console.log(params);
	let { longUrl } = params;
	let { followUp } = params;
	let { id } = params;
	let { price } = params;
	let { phone } = params;
	let { shop } = params;
	let { name } = params;
	let baseUrl = process.env.BASEURL;
	// Check base url
	if (!validUrl.isUri(baseUrl)) {
		return 'Invalid base url';
	}
	// Create url code
	const urlCode = shortid.generate();
	// Check long url /
	if (validUrl.isUri(longUrl)) {
		try {
			let url = await Url.findOne({
				longUrl
			});
			if (url) {
				Url.findOneAndUpdate(
					{
						id: url.id
					},
					{
						$push: {
							followUp: followUp
						}
					},
					{
						new: true,
						useFindAndModify: false
					},
					(err, result) => {
						if (!err) {
							console.log('result from 96', result);
						} else {
							console.log('error from 98', err);
						}
					}
				);
				let shopDetail = await Store.findOne({
					name: shop
				});
				let senderId = shopDetail.data['sender id'];
				let message = 'letMessage';
				await Store.findOne(
					{
						name: shop,
						orders: {
							$elemMatch: {
								id: id
							}
						}
					},
					(err, data) => {
						if (err) {
							console.log(err);
						} else {
							data.orders.forEach((e) => {
								if (e.id === id) {
									name = e.name;
									vendor = e.vendor;
								}
							});
						}
					}
				);
				await Store.findOne(
					{
						name: shop,
						abandanTemplate: {
							$elemMatch: {
								topic: followUp
							}
						}
					},
					(err, data) => {
						if (err) {
							console.log(err);
						} else {
							data.abandanTemplate.forEach((e) => {
								if (e.topic === followUp + '') {
									message = e.template;
									for (let i = 0; i < message.length; i++) {
										message = message.replace('${customer_name}', name);
										message = message.replace('${store_name}', vendor);
										message = message.replace('${abandoned_checkout_url}', url.shortUrl);
										message = message.replace('${amount}', url.price);
									}
									sendSms(phone, message, senderId, shop);
								}
							});
						}
					}
				);
				return url;
			} else {
				console.log('url !found, save new URL');
				const shortUrl = baseUrl + '/' + 's' + '/' + urlCode;
				url = new Url({
					urlCode,
					longUrl,
					shortUrl,
					followUp,
					id,
					shop,
					price
					//   name
				});
				await url.save();
				let shopDetail = await Store.findOne({
					name: shop
				});
				let senderId = shopDetail.data['sender id'];
				let message = 'Message';
				await Store.findOne(
					{
						name: shop,
						orders: {
							$elemMatch: {
								id: id
							}
						}
					},
					(err, data) => {
						if (err) {
							console.log(err);
						} else {
							data.orders.forEach((e) => {
								if (e.id === id) {
									name = e.name;
									vendor = e.vendor;
								}
							});
						}
					}
				);
				await Store.findOne(
					{
						name: shop,
						abandanTemplate: {
							$elemMatch: {
								topic: followUp
							}
						}
					},
					(err, data) => {
						if (err) {
							console.log(err);
						} else {
							data.abandanTemplate.forEach(async (e) => {
								if (e.topic === followUp + '') {
									message = e.template;
									for (let i = 0; i < message.length; i++) {
										message = message.replace('${customer_name}', name);
										message = message.replace('${store_name}', vendor);
										message = message.replace('${abandoned_checkout_url}', shortUrl);
										message = message.replace('${amount}', price);
									}
									sendSms(phone, message, senderId, shop);
								}
							});
						}
					}
				);
				return url;
			}
		} catch (err) {
			console.error('err 109 -->', err);
			return 'Server error';
		}
	} else {
		return 'Invalid long url';
	}
};

module.exports.shorten = shorten;
