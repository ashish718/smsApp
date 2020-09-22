const Store = require('../models/Shop');
let {sendSms} = require('../utils/sms')

exports.WebhookResponse = async (request, response)=>{
  const shop = request.params.shop;
  let topic = request.params.topic;
  const subtopic = request.params.subtopic;
  topic = topic + '/' + subtopic;
  console.log('topic -->', topic);
  Store.findOne(
    {
      name: shop
    },
    async (err, data) => {
      if (!err) {
        let name;

        let vendor;
        let title;
        let orderId;
        let price;
        let phone;
        let phone1;
        let phone2;

        let message;
        let checkoutName;
        switch (topic) {
          case 'checkouts/update':
            console.log('checkouts/create response');

            if (request.body.shipping_address != undefined) {
              if (request.body.shipping_address.phone != null) {
                Store.findOne(
                  {
                    name: shop,
                    orders: {
                      $elemMatch: {
                        id: request.body.id
                      }
                    }
                  },
                  (err, data) => {
                    if (err) {
                      console.log(err);
                    } else {
                      if (data === null) {
                        console.log('save new order');
                        console.log(request.body);
                        let a = request.body.subtotal_price;
                        let b = request.body.total_price;
                        let c = request.body.total_line_items_price;
                        console.log(a, 'subtotal');
                        console.log(b, 'total');
                        console.log(c, 'total_line_price');
                        if (request.body.customer.first_name) {
                          checkoutName = request.body.customer.first_name;
                        } else {
                          if (request.body.shipping_address.name) {
                            checkoutName = request.body.shipping_address.name;
                          } else {
                            checkoutName = request.body.billing_address.name;
                          }
                        }
                        let obj = {
                          id: request.body.id,
                          phone: request.body.shipping_address.phone.replace(/\s/g, ''),
                          name: checkoutName,
                          email: request.body.email,
                          vendor: request.body.line_items[0].vendor,
                          price: request.body.subtotal_price,
                          url: request.body.abandoned_checkout_url
                        };
                        Store.findOne(
                          {
                            name: shop
                          },
                          function(err, data) {
                            if (data.abandanTemplate) {
                              data.abandanTemplate.forEach((e) => {
                                if (e.topic === '1' && e.status === true) {
                                  obj.f1 = moment().add(e.time, 'minutes').format();
                                } else if (e.topic === '2' && e.status === true) {
                                  obj.f2 = moment().add(e.time, 'minutes').format();
                                } else if (e.topic === '3' && e.status === true) {
                                  obj.f3 = moment().add(e.time, 'minutes').format();
                                } else if (e.topic === '4' && e.status === true) {
                                  obj.f4 = moment().add(e.time, 'minutes').format();
                                }
                              });
                              Store.findOneAndUpdate(
                                {
                                  name: shop
                                },
                                {
                                  $addToSet: {
                                    orders: obj
                                  }
                                },
                                {
                                  new: true,
                                  useFindAndModify: false
                                },
                                (err, data) => {
                                  if (!err) {
                                    console.log('data add to DB', topic, data);
                                  } else {
                                    console.log('556 err', err);
                                  }
                                }
                              );
                            } else {
                              console.log('There is no abandanTemplate data');
                            }
                          }
                        );
                      } else {
                        console.log('bypass');
                      }
                    }
                  }
                );
              }
            }
            break;
          case 'orders/create':
            console.log('orders/create response');

            console.log(
              'some if result: ',
              data.data['orders/create customer'],
              data.data['orders/create admin'],
              'data.data starts from here',
              data.data
            );

            name = request.body.shipping_address.first_name;
            email = request.body.email;
            order_status_url = request.body.order_status_url;
            vendor = request.body.line_items[0].vendor;
            title = request.body.line_items[0].title;
            orderId = request.body.name;
            orderId = orderId.slice(1);
            price = request.body.total_price;
            if (request.body.customer.phone) {
              phone = request.body.customer.phone;
            } else if (request.body.billing_address.phone) {
              phone = request.body.billing_address.phone;
            } else {
              phone = request.body.shipping_address.phone;
            }
            try {
              let updated = await Store.updateOne(
                {
                  name: shop,
                  'orders.id': request.body.checkout_id
                },
                {
                  $set: {
                    'orders.$.purchase': true
                  }
                }
              );
              // if (updated) {
              console.log(updated, 'updated');

              //check if through our abandan message converted these sales

              try {
                let ourConverted = await Store.updateOne(
                  {
                    name: shop,
                    clicked: {
                      $elemMatch: {
                        checkoutId: request.body.checkout_id
                      }
                    }
                  },
                  {
                    $set: {
                      'clicked.$.converted': true
                    }
                  }
                );

                console.log(ourConverted);
              } catch (error) {
                console.error(error);
              }
              // }
            } catch (error) {
              console.error(error);
              console.log('unable to mark as purchase true');
            }

            if (data.data['orders/create customer'] === true && data.data['orders/create admin'] === true) {
              console.log('both true at orders/create');
              // data.smsCount + 2
              // Store.findOneAndUpdate(
              // 	{
              // 		name: shop
              // 	},
              // 	{
              // 		$set: {
              // 			smsCount: data.smsCount - 1
              // 		}
              // 	},
              // 	{
              // 		new: true,
              // 		useFindAndModify: false
              // 	},
              // 	(err, data) => {
              // 		if (!err) {
              // 			console.log('data remove', topic, data);
              // 		} else {
              // 			console.log('err 620', err);
              // 		}
              // 	}
              // );
            }
            if (data.data['orders/create customer'] === true) {
              console.log('customer true at orders/create');

              message = `Hi%20${name},%20Thanks%20for%20shopping%20with%20us!%20Your%20order%20is%20confirmed,%20and%20will%20be%20shipped%20shortly.%20Your%20order%20ID:%20${orderId}`;
              if (data.template !== undefined) {
                data.template.forEach((element) => {
                  if (element.topic === topic) {
                    if (element.customer) {
                      message = element.customer;
                      console.log('messane before replace');
                      for (let i = 0; i < message.length; i++) {
                        if (message.includes('${name}')) {
                          message = message.replace('${name}', name);
                        }
                        if (message.includes('${order_status_url}')) {
                          message = message.replace('${order_status_url}', order_status_url);
                        }
                        if (message.includes('${vendor}')) {
                          message = message.replace('${vendor}', vendor);
                        }
                        if (message.includes('${price}')) {
                          message = message.replace('${price}', price);
                        }
                        if (message.includes('${order_id}')) {
                          message = message.replace('${order_id}', orderId);
                        }
                        if (message.includes('${title}')) {
                          message = message.replace('${title}', title);
                        }
                      }
                    } else {
                      console.log('orders/create customer message template not found');
                    }
                  } else {
                    console.log('orders/create customer message template not found');
                  }
                });
              }
              //end
              //check for senderId
              let senderID;
              if (data.data['sender id']) {
                senderID = await data.data['sender id'];
              } else {
                senderID = 'shopit';
                console.log("This shop don't have senderId");
              }
              if (phone) {
                sendSms(phone, message, senderID, shop);
              } else {
                console.log("create/order didn't come with phone no");
              }
            }

            if (data.data['orders/create admin'] === true) {
              console.log('admin true at orders/create');

              message = `Customer%20name:%20${name},from%20shop:${shop}%20order%20ID:%20${orderId}`;
              if (data.template !== undefined) {
                data.template.forEach((element) => {
                  if (element.topic === topic) {
                    if (element.admin) {
                      message = element.admin;
                      for (let i = 0; i < message.length; i++) {
                        if (message.includes('${name}')) {
                          message = message.replace('${name}', name);
                        }
                        if (message.includes('${vendor}')) {
                          message = message.replace('${vendor}', vendor);
                        }
                        if (message.includes('${price}')) {
                          message = message.replace('${price}', price);
                        }
                        if (message.includes('${order_id}')) {
                          message = message.replace('${order_id}', orderId);
                        }
                        if (message.includes('${title}')) {
                          message = message.replace('${title}', title);
                        }
                      }
                    } else {
                      console.log('orders/create admin message template not found');
                    }
                  } else {
                    console.log('orders/create admin message template not found');
                  }
                });
              }
              let admin;
              let senderID;
              try {
                admin = await data.data['admin no'];
                senderID = await data.data['sender id'];
              } catch (error) {
                console.log(error, 'does not have senderid or admin no');
              }
              //end
              if (admin && message && senderID && shop) {
                try {
                  sendSms(admin, message, senderID, shop);
                } catch (error) {
                  console.error(error);
                }
              } else {
                console.log('missing admin no or message or senderid or shop');
              }
            }
            break;
          case 'orders/fulfilled':
            console.log('orders/fulfilled response');

            name = request.body.shipping_address.first_name;
            email = request.body.email;
            vendor = request.body.line_items[0].vendor;
            title = request.body.line_items[0].title;
            orderId = request.body.name;
            orderId = orderId.slice(1);
            price = request.body.total_price;
            phone = request.body.shipping_address.phone;
            phone1 = request.body.billing_address.phone;
            phone2 = request.body.customer.phone;
            address1 = request.body.shipping_address.address1;
            address2 = request.body.shipping_address.address2;
            city = request.body.shipping_address.city;
            country = request.body.shipping_address.country;
            fulfillment_status = request.body.fulfillment_status;
            updated_at = request.body.updated_at;
            order_status_url = request.body.order_status_url;
            if (data.data['orders/fulfilled customer'] === true && data.data['orders/fulfilled admin'] === true) {
              // data.smsCount + 2
              // Store.findOneAndUpdate(
              // 	{
              // 		name: shop
              // 	},
              // 	{
              // 		$set: {
              // 			smsCount: data.smsCount - 1
              // 		}
              // 	},
              // 	{
              // 		new: true,
              // 		useFindAndModify: false
              // 	},
              // 	(err, data) => {
              // 		if (!err) {
              // 			console.log('datacount + 1');
              // 		} else {
              // 			console.log('err', err);
              // 		}
              // 	}
              // );
            }
            if (data.data['orders/fulfilled customer'] === true) {
              message = `Hi%20${name},%20Thanks%20for%20shopping%20with%20us!%20Your%20order%20is%20confirmed,%20and%20fulfillment%20status%20is%20${fulfillment_status}%20updated%20at%20${updated_at}.Your%order%status%20${order_status_url}.%20Your%20order%20ID:%20${orderId}`;
              //end
              if (data.template !== undefined) {
                data.template.forEach((element) => {
                  if (element.topic === topic) {
                    if (element.customer) {
                      message = element.customer;
                      for (let i = 0; i < message.length; i++) {
                        if (message.includes('${name}')) {
                          message = message.replace('${name}', name);
                        }
                        if (message.includes('${vendor}')) {
                          message = message.replace('${vendor}', vendor);
                        }
                        if (message.includes('${price}')) {
                          message = message.replace('${price}', price);
                        }
                        if (message.includes('${order_id}')) {
                          message = message.replace('${order_id}', orderId);
                        }
                        if (message.includes('${title}')) {
                          message = message.replace('${title}', title);
                        }
                        if (message.includes('${fulfillment_status}')) {
                          message = message.replace('${fulfillment_status}', fulfillment_status);
                        }
                        if (message.includes('${order_status_url}')) {
                          message = message.replace('${order_status_url}', order_status_url);
                        }
                      }
                    } else {
                      console.log('orders/fulfille customer message template not found');
                    }
                  } else {
                    console.log('orders/fulfille customer message template not found');
                  }
                });
              }
              let senderID = data.data['sender id'];
              if (phone) {
                sendSms(phone, message, senderID, shop);
              } else if (phone1) {
                sendSms(phone, message, senderID, shop);
              } else if (phone2) {
                sendSms(phone, message, senderID, shop);
              }
            }
            if (data.data['orders/fulfilled admin'] === true) {
              let admin = data.data['admin no'];
              adminNumber = admin;
              let senderID = data.data['sender id'];
              message = `Customer%20name:%20${name},from%20shop:${shop}%20order%20ID:%20${orderId},%20Order%20Status%20${fulfillment_status}`;
              if (data.template !== undefined) {
                data.template.forEach((element) => {
                  if (element.topic === topic) {
                    if (element.admin) {
                      message = element.admin;
                      for (let i = 0; i < message.length; i++) {
                        if (message.includes('${name}')) {
                          message = message.replace('${name}', name);
                        }
                        if (message.includes('${vendor}')) {
                          message = message.replace('${vendor}', vendor);
                        }
                        if (message.includes('${price}')) {
                          message = message.replace('${price}', price);
                        }
                        if (message.includes('${order_id}')) {
                          message = message.replace('${order_id}', orderId);
                        }
                        if (message.includes('${title}')) {
                          message = message.replace('${title}', title);
                        }
                        if (message.includes('${fulfillment_status}')) {
                          message = message.replace('${fulfillment_status}', fulfillment_status);
                        }
                        if (message.includes('${order_status_url}')) {
                          message = message.replace('${order_status_url}', order_status_url);
                        }
                        if (message.includes('${updated_at}')) {
                          message = message.replace('${updated_at}', updated_at);
                        }
                      }
                    } else {
                      console.log('orders/fulfillment admin message template not found');
                    }
                  } else {
                    console.log('orders/fulfilled admin message template not found');
                  }
                });
              }
              sendSms(admin, message, senderID, shop);
            }
            break;
          case 'orders/cancelled':
            console.log('orders/cancelled response');

            name = request.body.shipping_address.first_name;
            if (name == undefined || name == null) {
              name = request.body.billing_address.first_name;
              name = request.body.customer.first_name;
            }
            email = request.body.email;
            vendor = request.body.line_items[0].vendor;
            title = request.body.line_items[0].title;
            orderId = request.body.name;
            orderId = orderId.slice(1);
            price = request.body.total_price;
            phone = request.body.shipping_address.phone;
            phone1 = request.body.billing_address.phone;
            phone2 = request.body.customer.phone;
            address1 = request.body.shipping_address.address1;
            address2 = request.body.shipping_address.address2;
            city = request.body.shipping_address.city;
            country = request.body.shipping_address.country;
            cancelled_at = request.body.cancelled_at;
            cancel_reason = request.body.cancel_reason;
            if (data.data['orders/cancelled customer'] === true && data.data['orders/cancelled admin'] === true) {
              // Store.findOneAndUpdate(
              // 	{
              // 		name: shop
              // 	},
              // 	{
              // 		$set: {
              // 			smsCount: data.smsCount - 1
              // 		}
              // 	},
              // 	{
              // 		new: true,
              // 		useFindAndModify: false
              // 	},
              // 	(err, data) => {
              // 		if (!err) {
              // 			console.log('datacount + 1');
              // 		} else {
              // 			console.log('err', err);
              // 		}
              // 	}
              // );
            }
            if (data.data['orders/cancelled customer'] === true) {
              message = `Hi%20${name}%20your%20order%20ID:%20${orderId}%20is%20cancelled.%20We%20will%20process%20refund%20soon.`;
              if (data.template !== undefined) {
                data.template.forEach((element) => {
                  if (element.topic === topic) {
                    if (element.customer) {
                      message = element.customer;
                      for (let i = 0; i < message.length; i++) {
                        if (message.includes('${name}')) {
                          message = message.replace('${name}', name);
                        }
                        if (message.includes('${vendor}')) {
                          message = message.replace('${vendor}', vendor);
                        }
                        if (message.includes('${price}')) {
                          message = message.replace('${price}', price);
                        }
                        if (message.includes('${orderId}')) {
                          message = message.replace('${orderId}', orderId);
                        }
                        if (message.includes('${order_id}')) {
                          message = message.replace('${order_id}', orderId);
                        }
                        if (message.includes('${title}')) {
                          message = message.replace('${title}', title);
                        }
                        if (message.includes('${cancel_reason}')) {
                          message = message.replace('${cancel_reason}', cancel_reason);
                        }
                      }
                    } else {
                      console.log('orders/cancelled customer message template not found');
                    }
                  } else {
                    console.log('orders/cancelled customer message template not found');
                  }
                });
              }
              //end
              let senderID = data.data['sender id'];
              if (phone) {
                sendSms(phone, message, senderID, shop);
              } else if (phone1) {
                sendSms(phone, message, senderID, shop);
              } else if (phone2) {
                sendSms(phone, message, senderID, shop);
              }
            }
            if (data.data['orders/cancelled admin'] === true) {
              let admin = data.data['admin no'];
              adminNumber = admin;
              let senderID = data.data['sender id'];
              message = `Customer%20name:%20${name},cancelled%20order%20beacuse%20${cancel_reason},order%20ID:%20${orderId}`;
              if (data.template !== undefined) {
                data.template.forEach((element) => {
                  if (element.topic === topic) {
                    if (element.admin) {
                      message = element.admin;
                      for (let i = 0; i < message.length; i++) {
                        if (message.includes('${name}')) {
                          message = message.replace('${name}', name);
                        }
                        if (message.includes('${vendor}')) {
                          message = message.replace('${vendor}', vendor);
                        }
                        if (message.includes('${price}')) {
                          message = message.replace('${price}', price);
                        }
                        if (message.includes('${order_id}')) {
                          message = message.replace('${order_id}', orderId);
                        }
                        if (message.includes('${title}')) {
                          message = message.replace('${title}', title);
                        }
                      }
                    } else {
                      console.log('orders/cancelled admin message template not found');
                    }
                  } else {
                    console.log('orders/cancelled admin message template not found');
                  }
                });
              }
              sendSms(admin, message, senderID, shop);
            }
            break;
          case 'app/uninstalled':
            //! todo
            console.log(`app uninstallation request from ${shop}`);

            try {
              const uninstalle = await Store.findOneAndUpdate(
                {
                  name: shop
                },
                {
                  $set: {
                    uninstalled: true
                  }
                },
                {
                  new: true,
                  useFindAndModify: false
                }
              );
              console.log('someone uninstalled app', shop);
              console.log(uninstalle);
            } catch (error) {
              console.error(error);
            }

            break;
          default:
            console.log('!possible');
            break;
        }
      } else {
        console.log(err);
      }
    }
  );
  response.sendStatus(200);
}
