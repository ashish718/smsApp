const Store = require('../models/Shop');
let {shopifyWebhook} = require('../utils/CreateWebhook')

exports.myapiaction = async (req, res)=>{

  if (req.session.shop) {
		let shop = req.session.shop;
		let token = req.session.token;
		let hmac = req.session.hmac;
		console.log('req.body-->320 line details from settings', req.body);
		Store.findOne(
			{
				name: shop
			},
			function(err, data) {
				if (data) {
					console.log('store found in DB');
					// res.sendStatus(200).redirect('back');
					res.sendStatus(200);
					// res.redirect("back");
					Store.findOneAndUpdate(
						{
							name: shop
						},
						{
							$set: {
								data: req.body,
								uninstalled: false
							}
						},
						{
							new: true,
							useFindAndModify: false
						},
						(err, data) => {
							if (!err) {
								//   console.log("datacount + 1");
							} else {
								console.log('238 err-->', err);
							}
						}
					);
				} else {
					console.log('store !found in DB');
					const store = new Store({
						name: shop,
						uninstalled: false,
						recharge: 10,
						data: req.body,
						smsCount: 10,
						template: [
							{
								topic: 'orders/create',
								customer:
									'`Hi%20${name},%20Thanks%20for%20shopping%20with%20us!%20Your%20order%20is%20confirmed.%20Your%20order%20ID:%20${order_id}`',
								admin: '`Hi%20Admin,%20${name}%20placed%20order`'
							},
							{
								topic: 'orders/cancelled',
								customer:
									'`Hi%20${name}%20your%20order%20ID:%20${order_id}%20is%20cancelled.%20We%20started%20your%20refund%20process.`',
								admin: '`Hi%20Admin,%20${name}%20cancelled%20order%20`'
							},
							{
								topic: 'orders/fulfilled',
								customer:
									'`Hi%20${name}%20your%20order%20ID:%20${order_id}%20is%20fulfilled.%20We%20started%20your%20delivery%20process.`',
								admin: "`Hi%20Admin,%20${name}'s%20order%20fulfilled`"
							}
						],
						abandanTemplate: [
							{
								topic: '1',
								template:
									"`Hey%20${customer_name}!%20We%20noticed%20you%20left%20some%20items%20in%20your%20cart.%20Get%20them%20before%20they're%20gone!%20Visit%20this%20link%20to%20complete%20the%20order:%20${abandoned_checkout_url}.%20-${store_name}`",
								time: '30',
								status: false
							},
							{
								topic: '2',
								template:
									"`Hey%20${customer_name}!%20We%20noticed%20you%20left%20some%20items%20in%20your%20cart.%20Get%20them%20before%20they're%20gone!%20Visit%20this%20link%20to%20complete%20the%20order:%20${abandoned_checkout_url}.%20-${store_name}`",
								time: '60',
								status: false
							},
							{
								topic: '3',
								template:
									"`Hey%20${customer_name}!%20We%20noticed%20you%20left%20some%20items%20in%20your%20cart.%20Get%20them%20before%20they're%20gone!%20Visit%20this%20link%20to%20complete%20the%20order:%20${abandoned_checkout_url}.%20-${store_name}`",
								time: '60',
								status: false
							},
							{
								topic: '4',
								template:
									"`Hey%20${customer_name}!%20We%20noticed%20you%20left%20some%20items%20in%20your%20cart.%20Get%20them%20before%20they're%20gone!%20Visit%20this%20link%20to%20complete%20the%20order:%20${abandoned_checkout_url}.%20-${store_name}`",
								time: '60',
								status: false
							}
						]
					});
					store.save(function(err, data) {
						if (!err) {
							console.log(`${shop} data store to DB`, data);
						} else {
							console.log(err);
						}
					});
					var topics = [
						'orders/cancelled',
						'orders/fulfilled',
						'orders/create',
						'checkouts/create',
						'checkouts/update',
						'app/uninstalled'
					];
					topics.forEach((topic) => {
						shopifyWebhook(topic, token, hmac, shop);
						console.log({topic, token, hmac, shop});
					});
					res.sendStatus(200);
					// .redirect(`https://${shop}/admin/apps/sms_update`);
				}
			}
		);
	} else {
		console.log('cant find session key form post /myacion');
	}
}


exports.templateSetting = async(req, res)=>{
  // req.session.shop = 'uadaan.myshopify.com'; //delete this localTesting
	console.log('template change request-->', req.body);
	console.log('template change request shop-->', req.session.shop);
	res.sendStatus(200);
	let topic = req.body.topic.trim();
	let customer = '';
	let admin = '';
	//check in db if there is any template is present then switch it to value
	if (req.body['customerTemplate'] != null) {
		console.log('customer value 1 ');
		customer = req.body['customerTemplate'];
		console.log(topic);
		console.log(customer);
		if (req.session.shop) {
			Store.findOneAndUpdate(
				{
					name: req.session.shop,
					'template.topic': topic
				},
				{
					$set: {
						'template.$.topic': topic,
						'template.$.customer': customer
					}
				},
				{
					new: true,
					useFindAndModify: false
				},
				(err, result) => {
					if (err) {
						console.log(err);
					} else {
						let obj = {
							topic: topic,
							customer: customer,
							admin: admin
						};
						if (result === null) {
							console.log('result === null');
							Store.findOneAndUpdate(
								{
									name: req.session.shop
								},
								{
									// $addToSet: { template: req.body }
									$addToSet: {
										template: obj
									}
								},
								{
									new: true,
									useFindAndModify: false
								},
								(err, data) => {
									console.log('delte form db');
									if (!err) {
										console.log('data-template->', data);
									} else {
										console.log('err');
									}
								}
							);
						}
					}
				}
			);
		} else {
			console.log('session timeout');
		}
	} else {
		admin = req.body['adminTemplate'];
		if (req.session.shop) {
			Store.findOneAndUpdate(
				{
					name: req.session.shop,
					'template.topic': topic
				},
				{
					$set: {
						'template.$.topic': topic,
						// "template.$.customer": customer,
						'template.$.admin': admin
					}
				},
				{
					new: true,
					useFindAndModify: false
				},
				(err, result) => {
					if (err) {
						console.log(err);
					} else {
						let obj = {
							topic: topic,
							customer: customer,
							admin: admin
						};
						if (result === null) {
							Store.findOneAndUpdate(
								{
									name: req.session.shop
								},
								{
									// $addToSet: { template: req.body }
									$addToSet: {
										template: obj
									}
								},
								{
									new: true,
									useFindAndModify: false
								},
								(err, data) => {
									console.log('delte form db');
									if (!err) {
										console.log('data');
									} else {
										console.log('err');
									}
								}
							);
						}
					}
				}
			);
		} else {
			console.log('session timeout');
		}
	}
}

exports.abandanTemplateSetting = async(req, res)=>{
  console.log(req.body, 'AT body');
  // req.session.shop = 'uadaan.myshopify.com'; //delete this localTesting
  if (req.session.shop) {
    Store.findOneAndUpdate(
      {
        name: req.session.shop,
        'abandanTemplate.topic': req.body.topic
      },
      {
        $set: {
          'abandanTemplate.$.topic': req.body.topic,
          'abandanTemplate.$.template': req.body.template,
          'abandanTemplate.$.time': req.body.time,
          'abandanTemplate.$.status': req.body.status
        }
      },
      {
        new: true,
        useFindAndModify: false
      },
      (err, result) => {
        console.log(result, 'result');
        if (err) {
          console.log(err);
        } else {
          if (result === null) {
            console.log('result ==null');
            Store.findOneAndUpdate(
              {
                name: req.session.shop
              },
              {
                $addToSet: {
                  abandanTemplate: req.body
                }
              },
              {
                new: true,
                useFindAndModify: false
              },
              (err, data) => {
                if (!err) {
                  console.log('data', data);
                } else {
                  console.log('err');
                }
              }
            );
          }
        }
      }
    );
  } else {
    console.log('session timeout');
  }

  res.sendStatus(200);
}
