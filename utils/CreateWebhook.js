require('dotenv').config();
const request = require('request-promise');
const forwardingAddress = process.env.BASEURL

let shopifyWebhook = async(topic, token, hmac, shop)=>{
  const webhookUrl = 'https://' + shop + '/admin/api/2019-07/webhooks.json';
	const webhookHeaders = {
		'Content-Type': 'application/json',
		'X-Shopify-Access-Token': token,
		'X-Shopify-Topic': topic,
		'X-Shopify-Hmac-Sha256': hmac,
		'X-Shopify-Shop-Domain': shop,
		'X-Shopify-API-Version': '2019-07'
	};
	const webhookPayload = {
		webhook: {
			topic: topic,
			address: `${forwardingAddress}/webhook/store/${shop}/${topic}`,
			format: 'json'
		}
	};
	request
		.post(webhookUrl, {
			headers: webhookHeaders,
			json: webhookPayload
		})
		.then((shopResponse) => {
			console.log('webhook topic :', topic);
		})
		.catch((error) => {
			console.log('309 error-->', error);
		});
}

module.exports.shopifyWebhook = shopifyWebhook
