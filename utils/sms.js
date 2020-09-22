const Store = require('../models/Shop');
const request = require('request-promise');

let sendSms = (phone, message, senderID, shop)=>{
  console.log("sms api hit");
	message = message.replace(/ /g, '%20');
	console.log('type:->> ', typeof phone, phone, 'phone 971 webhook');
	console.log(phone, '<-- phone sndSmS');
	console.log(message, '<-- messge sndSmS');
	console.log(senderID, '<-- senderID sndSmS');
	console.log(shop, '<-- shop sndSmS');
	//to ensure message does not contains backticks
	for (let i = 0; i < message.length; i++) {
		message = message.replace('`', '');
		message = message.replace('$', '');
		// message = message.replace('%', '');
		message = message.replace('@', '');
		message = message.replace('^', '');
		message = message.replace('&', '');
		message = message.replace('*', '');
		message = message.replace('<', '');
		message = message.replace('>', '');
		message = message.replace('#', '');
	}
	// to ensure phone no. is of 10 digits remove first "0" of phone no
	phone = phone.toString();
	if (phone.includes('e') || phone.includes('-')) {
		console.log("phone no. includes '-' or 'e', that's why we can't send message");
	}
	phone = phone.replace(/ /g, '');
	let fn = phone[0];
	console.log(fn), 'fn';
	if (fn === '0' || fn === '1' || fn === '2' || fn === '3' || fn === '4' || fn === '5') {
		phone = phone.replace(fn, '');
	}
	fn = phone[0];
	console.log(fn), 'fn';
	if (fn === '0' || fn === '1' || fn === '2' || fn === '3' || fn === '4' || fn === '5') {
		phone = phone.replace(fn, '');
	}
	fn = phone[0];
	console.log(fn), 'fn';
	if (fn === '0' || fn === '1' || fn === '2' || fn === '3' || fn === '4' || fn === '5') {
		phone = phone.replace(fn, '');
	}
	console.log(typeof phone, phone, 'after removing');
	console.log(phone.length);
	if (phone.length >= 10) {
		phone = parseInt(phone);
		console.log(typeof phone, phone, 'after converting');
	} else {
		console.log(" can't send sms because, phone number is < 10 digits i.e : ", phone);
	}
	Store.findOne(
		{
			name: shop
		},
		async function (err, data){
			if (!err) {
				console.log('dddsdsd df dkv dv ckd v d')
				let smsapi = process.env.SMS_API;
				let LeftSMS = data.smsCount - data.sms.length;
				if (LeftSMS > 0) {
					//send SMS

var options = {
	method: 'GET',
  url: 'https://global.datagenit.com/API/sms-api.php',
  qs:
   { auth: 'D!~42924V0hc35Jaf',
     senderid: senderID,
     msisdn: phone,
     message: message },
  headers:
   {'cache-control': 'no-cache' },
 rejectUnauthorized: false };
					//  var options = {
          //   method: "GET",
          //   hostname: "api.datagenit.com",
          //   port: null,
          //   path: `https://api.datagenit.com/sms?auth=${smsapi}&msisdn=${phone}&senderid=${senderID}&message=${message}`,
          //   headers: {},
          // };
					try {
						console.log("options", options);

								var req =  request(options, function (error, response, body) {
								  if (error) throw new Error("sms error send",error);

								  console.log(body);
									return body
								});
						// var req =  request(options, function(res) {
						// 	console.log(res);
						// 	var chunks = [];
						// 	// res.on('data', function(chunk) {
						// 	// 	chunks.push(chunk);
						// 	// });
						// 	// res.on('end', function() {
						// 	// 	var body = Buffer.concat(chunks);
						// 	// 	console.log(body.toString());
						// 	// });
						// });
					} catch (error) {
						console.error("sms couldn't send because of:", error);
					}
					//save sms data to DB
					var obj = {
						description: message.replace(/%20/g, ' ').replace(/%0A/g, ' '),
						term: phone
					};
					``;
					Store.findOneAndUpdate(
						{
							name: shop
						},
						{
							$push: {
								sms: obj
							}
						},
						{
							new: true,
							useFindAndModify: false
						},
						(err, data) => {
							if (!err) {
								console.log('data');
							} else {
								console.log('err', err);
							}
						}
					);
					req.end();
				} else if (LeftSMS < 1) {
					console.log('SMS Quota Exhausted');
					// Store.findOneAndUpdate(
					// 	{
					// 		name: shop
					// 	},
					// 	{
					// 		$push: {
					// 			sms: obj
					// 		},
					// 		$set: {
					// 			smsCount: 0
					// 		}
					// 	},
					// 	{
					// 		new: true,
					// 		useFindAndModify: false
					// 	},
					// 	(err, data) => {
					// 		if (!err) {
					// 			console.log('data');
					// 		} else {
					// 			console.log('err', err);
					// 		}
					// 	}
					// );
				} else {
					console.log('admin still not recharge');
				}
			}
		}
	);
}

module.exports.sendSms = sendSms
