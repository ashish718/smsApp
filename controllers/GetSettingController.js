const Store = require('../models/Shop');

exports.optionFunc = async(req, res)=>{
  // req.session.shop = 'demo-mojito.myshopify.com';
  if (req.session.shop) {
    try {
      const result = await Store.findOne({
        name: req.session.shop
      });
      console.log('data found');

      if (result) {
        res.send(result.data);
      }
    } catch (error) {
      res.send('');
      console.error(error);
    }
  } else {
    console.log('cant find session key form get /api/smsCount || your session timeout');
  }
}

exports.abandanTemplateFunc = async(req, res)=>{
  // req.session.shop = 'demo-mojito.myshopify.com';
  if (req.session.shop) {
    try {
      const data = await Store.findOne({
        name: req.session.shop
      });

      res.send(data.abandanTemplate);
    } catch (error) {
      console.error(error);
      res.send('!found');
    }
  } else {
    console.log('cant find session key form get /api/abandanTemplate || your session timeout');
  }
}

exports.templateFunc = async(req, res)=>{
  // req.session.shop = 'demo-mojito.myshopify.com'; //delete this localTesting
	console.log('API called');
	if (req.session.shop) {
		try {
			const data = await Store.findOne({
				name: req.session.shop
			});

			res.send(data.template);
		} catch (error) {
			console.error(error);
			res.send('!found');
		}
	} else {
		console.log('cant find session key form get /api/abandanTemplate || your session timeout');
	}
}

exports.smsCountFunc = async(req, res)=>{
  // req.session.shop = 'demo-mojito.myshopify.com'; //delete this localTesting
	if (req.session.shop) {
		try {
			let our = await Store.findOne({ name: req.session.shop });
			let leftSMS = our.smsCount - our.sms.length;
			leftSMS = leftSMS + '';
			res.send(leftSMS).status(200);
		} catch (error) {
			res.send('0');
			console.error(error);
		}
	} else {
		console.log('cant find session key form get /api/smsCount || your session timeout');
	}
}

exports.historyFunc = async(req, res)=>{
  // req.session.shop = 'demo-mojito.myshopify.com';
	// if (req.session.views[pathname]) {
	try {
		let data = await Store.findOne({ name: req.session.shop });
		if (data) {
			var history = data.sms;
			history = history.reverse();
			history.length = 50;
			res.send(history);
		}
	} catch (error) {
		console.error(error);
	}
	// } else {
	// 	console.log('cant find session key form get /api/history || your session timeout');
	// }
}

exports.dashboardFunc = async(req, res)=>{
  // req.session.shop = 'demo-mojito.myshopify.com';

	if (req.session.shop) {
		let convertedFolowUpCount = [ 0, 0, 0, 0 ];
		let convertedFolowUpPrice = [ 0, 0, 0, 0 ];
		let clickThroughCount = [ 0, 0, 0, 0 ];
		try {
			const currentStore = await Store.findOne({
				name: req.session.shop
			});

			currentStore.clicked.forEach(async (element) => {
				//converted followUp count and price
				if (element.converted === true) {
					let last = element.followUp[element.followUp.length - 1];
					if (last === 1) {
						convertedFolowUpCount[0]++;
						console.log(element.price, 1);
						convertedFolowUpPrice[0] = convertedFolowUpPrice[0] + element.price;
					}
					if (last === 2) {
						console.log(element.price, 2);
						convertedFolowUpCount[1]++;
						convertedFolowUpPrice[1] = convertedFolowUpPrice[1] + element.price;
					}
					if (last === 3) {
						console.log(element.price, 3);
						convertedFolowUpCount[2]++;
						convertedFolowUpPrice[2] = convertedFolowUpPrice[2] + element.price;
					}
					if (last === 4) {
						console.log(element.price, 4);
						convertedFolowUpCount[3]++;
						convertedFolowUpPrice[3] = convertedFolowUpPrice[3] + element.price;
					}
				} else {
					if (element.followUp.includes(1)) {
						clickThroughCount[0]++;
					}
					if (element.followUp.includes(2)) {
						clickThroughCount[1]++;
					}
					if (element.followUp.includes(3)) {
						clickThroughCount[2]++;
					}
					if (element.followUp.includes(4)) {
						clickThroughCount[3]++;
					}
				}
			});
			console.log(convertedFolowUpCount, 'count');
			console.log(convertedFolowUpPrice, 'price');
			console.log(clickThroughCount, 'click');
			res.send({ convertedFolowUpPrice, convertedFolowUpCount, clickThroughCount });
		} catch (error) {
			console.error(error);

			res.send({
				convertedFolowUpCount: [ 9, 9, 9, 9 ],
				clickThroughCount: [ 99, 99, 99, 99 ],
				convertedFolowUpPrice: [ 999, 999, 999, 9 ]
			});
			console.log('cant find session key form get /api/dashboard || your session timeout');
		}
	}
}
