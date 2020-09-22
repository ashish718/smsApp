require('dotenv').config();
const session = require('express-session');
const shortid = require('shortid');
const validUrl = require('valid-url');
const colors = require('colors');
const path = require('path');
const parseurl = require('parseurl');
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const forwardingAddress = process.env.BASEURL

exports.InstallApp = async(req, res)=>{
  req.session.shop = req.query.shop;
	const shop = req.query.shop;
	if (shop) {
		const state = nonce();
		const redirectUri = forwardingAddress + '/shopify/callback';
		const installUrl =
			'https://' +
			shop +
			'/admin/oauth/authorize?client_id=' +
			apiKey +
			'&scope=' +
			[
				'read_products ',
				'read_customers',
				'read_fulfillments',
				'read_checkouts',
				'read_analytics',
				'read_orders ',
				'read_script_tags',
				'write_script_tags'
			] +
			'&state=' +
			state +
			'&redirect_uri=' +
			redirectUri;
		res.cookie(req.session.shop, state);
		res.redirect(installUrl);
	} else {
		return res
			.status(400)
			.send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
	}
}


exports.InstallAppCallback = async(req, res)=>{
  let { shop, hmac, code, state } = req.query;
	const stateCookie = cookie.parse(req.headers.cookie)[`${shop}`];
	if (state !== stateCookie) {
		return res.status(403).send('Request origin cannot be verified');
	}
	if (shop && hmac && code) {
		const map = Object.assign({}, req.query);
		delete map['signature'];
		delete map['hmac'];
		const message = querystring.stringify(map);
		const providedHmac = Buffer.from(hmac, 'utf-8');
		const generatedHash = Buffer.from(crypto.createHmac('sha256', apiSecret).update(message).digest('hex'), 'utf-8');
		let hashEquals = false;
		try {
			hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
		} catch (e) {
			hashEquals = false;
		}
		if (!hashEquals) {
			return res.status(400).send('HMAC validation failed');
		}
		const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
		const accessTokenPayload = {
			client_id: apiKey,
			client_secret: apiSecret,
			code
		};
		request
			.post(accessTokenRequestUrl, {
				json: accessTokenPayload
			})
			.then((accessTokenResponse) => {
				Gtoken = accessTokenResponse.access_token;
				req.session.hmac = hmac;
				req.session.token = accessTokenResponse.access_token;
				res.redirect('/');
			})
			.catch((error) => {
				res.send(error);
			});
	} else {
		res.status(400).send('Required parameters missing');
	}
}
