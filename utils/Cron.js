const moment = require('moment');
const Store = require('../models/Shop');

let cronFunction = async()=>{
  //getting list of all store name
  console.log('!production cron started');
  var storeName = [];
  try {
    const stores = await Store.find({
      uninstalled: false

      // smsCount: {
      // 	$gt: 0
      // }
    });

    stores.forEach(async (smsLeftStore) => {
      if (smsLeftStore.smsCount - smsLeftStore.sms.length > 0) {
        await storeName.push(smsLeftStore.name);
      }
    });

    // stores.forEach(async (store) => {
    // });

    let interval = moment().subtract(2, 'minutes').format();
    let current = moment().format();

    storeName.forEach(async (store) => {
      console.log('Performing on store-->', store);

      try {
        const data = await Store.findOne({ name: store });

        data.orders.forEach(async (order) => {
          if (order.f1 && order.purchase === false) {
            if (moment(order.f1).isBetween(interval, current)) {
              console.log('call shortner function for', order.f1);
              let obj = {
                longUrl: order.url,
                phone: order.phone,
                followUp: 1,
                id: order.id,
                price: order.price,
                vendor: order.vendor,
                name: order.name,
                shop: store
              };
              const short = async () => {
                let res = '';
                res = await shorten(obj);
                console.log('for followUP 1', res);
              };
              short();
            }
          }
          if (order.f2 && order.purchase === false) {
            if (moment(order.f2).isBetween(interval, current)) {
              console.log('call shortner function for', order.f2);
              let obj = {
                longUrl: order.url,
                followUp: 2,
                id: order.id,
                price: order.price,
                phone: order.phone,
                vendor: order.vendor,
                name: order.name,
                shop: store
              };
              const short = async () => {
                let res = '';
                res = await shorten(obj);
                console.log('for followUP 2', res);
              };
              short();
            }
          }
          if (order.f3 && order.purchase === false) {
            if (moment(order.f3).isBetween(interval, current)) {
              console.log('call shortner function for', order.f3);
              let obj = {
                longUrl: order.url,
                followUp: 3,
                id: order.id,
                price: order.price,
                phone: order.phone,
                vendor: order.vendor,
                name: order.name,
                shop: store
              };
              const short = async () => {
                let res = '';
                res = await shorten(obj);
                console.log('for followUP 3', res);
              };
              short();
            }
          }
          if (order.f4 && order.purchase === false) {
            if (moment(order.f4).isBetween(interval, current)) {
              console.log('call shortner function for', order.f4);
              let obj = {
                longUrl: order.url,
                followUp: 4,
                phone: order.phone,
                id: order.id,
                price: order.price,
                vendor: order.vendor,
                name: order.name,
                shop: store
              };
              const short = async () => {
                let res = '';
                res = await shorten(obj);
                console.log('for followUP 4', res);
              };
              short();
            }
          }
        });
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

 module.exports.cronFunction = cronFunction
