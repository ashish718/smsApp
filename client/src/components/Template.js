import React, { useCallback, useState, useEffect, Fragment } from 'react';
import { TextField, Layout, Card } from '@shopify/polaris';
import axios from 'axios';
export default function Template() {
	let defaultTopic = {
		topic: 'orders/create',
		topicVariables: 'name , price , order_id , title'
	};
	const [ topics, setTopics ] = useState(defaultTopic);
	const topicHandler = (params) => {
		const selectedElement = params.target;
		const selectedValue = selectedElement.title;
		console.log(selectedValue);
		switch (selectedValue) {
			case 'orders/create':
				axios.get('/api/template').then((res) => {
					console.log(res.data);
					try {
						res.data.forEach((element) => {
							if (element.topic === 'orders/create') {
								let inputData = element.customer;
								for (let i = 0; i < inputData.length; i++) {
									inputData = inputData.replace('%20', ' ');
									inputData = inputData.replace('${', '(');
									inputData = inputData.replace('}', ')');
									inputData = inputData.replace('`', '');
								}
								let inputAdmin = element.admin;
								for (let i = 0; i < inputAdmin.length; i++) {
									inputAdmin = inputAdmin.replace('%20', ' ');
									inputAdmin = inputAdmin.replace('${', '(');
									inputAdmin = inputAdmin.replace('}', ')');
									inputAdmin = inputAdmin.replace('`', '');
								}
								setTemplate1(inputData);
								setTemplate2(inputAdmin);
							}
						});
					} catch (error) {
						setTemplate1('');
						setTemplate2('');
						console.error(error);
					}
				});
				setTopics({
					...topics,
					topic: selectedValue,
					topicVariables: 'name , price , order_id , title , order_status_url'
				});
				break;
			case 'orders/cancelled':
				axios.get('/api/template').then((res) => {
					try {
						res.data.forEach((element) => {
							if (element.topic === 'orders/cancelled') {
								let inputData = element.customer;
								for (let i = 0; i < inputData.length; i++) {
									inputData = inputData.replace('%20', ' ');
									inputData = inputData.replace('${', '(');
									inputData = inputData.replace('}', ')');
									inputData = inputData.replace('`', '');
								}
								let inputAdmin = element.admin;
								for (let i = 0; i < inputAdmin.length; i++) {
									inputAdmin = inputAdmin.replace('%20', ' ');
									inputAdmin = inputAdmin.replace('${', '(');
									inputAdmin = inputAdmin.replace('}', ')');
									inputAdmin = inputAdmin.replace('`', '');
								}
								setTemplate1(inputData);
								setTemplate2(inputAdmin);
							}
						});
					} catch (error) {
						setTemplate1('');
						setTemplate2('');
						console.error(error);
					}
				});
				setTopics({
					...topics,
					topic: selectedValue,
					topicVariables: 'name , price , order_id , title , cancel_reason'
				});
				break;
			case 'orders/fulfilled':
				axios.get('/api/template').then((res) => {
					try {
						res.data.forEach((element) => {
							if (element.topic === 'orders/fulfilled') {
								let inputData = element.customer;
								for (let i = 0; i < inputData.length; i++) {
									inputData = inputData.replace('%20', ' ');
									inputData = inputData.replace('${', '(');
									inputData = inputData.replace('}', ')');
									inputData = inputData.replace('`', '');
								}
								let inputAdmin = element.admin;
								for (let i = 0; i < inputAdmin.length; i++) {
									inputAdmin = inputAdmin.replace('%20', ' ');
									inputAdmin = inputAdmin.replace('${', '(');
									inputAdmin = inputAdmin.replace('}', ')');
									inputAdmin = inputAdmin.replace('`', '');
								}
								setTemplate1(inputData);
								setTemplate2(inputAdmin);
							}
						});
					} catch (error) {
						setTemplate1('');
						setTemplate2('');
						console.error(error);
					}
				});
				setTopics({
					...topics,
					topic: selectedValue,
					topicVariables: 'name , price , order_id , title , fulfillment_status , order_status_url'
				});
				break;
			default:
				break;
		}
		let selectedElementClass = selectedElement.className;
		if (selectedElementClass.includes('butti')) {
			return;
		} else {
			let firstElement = document.getElementsByClassName('butti');
			if (firstElement) {
				let first = firstElement[0];
				first.className = 'butt ';
			}
			if (selectedElementClass.includes('butt ')) {
				selectedElementClass = selectedElementClass.replace('butt', 'butti ');
				params.target.className = selectedElementClass;
			}
		}
	};
	const sendTemplate = async (tempObj) => {
		// console.log(tempObj, 'before send post');
		let customerToSend = {
			topic: tempObj.topic,
			customerTemplate: ''
		};
		let adminToSend = {
			topic: tempObj.topic,
			adminTemplate: ''
		};
		tempObj.audience === 'customer'
			? (customerToSend.customerTemplate = tempObj.template)
			: (adminToSend.adminTemplate = tempObj.template);
		// console.log('customer', customerToSend, 'admin', adminToSend);
		if (customerToSend.topic && customerToSend.customerTemplate !== '``' && customerToSend.customerTemplate !== '') {
			console.log(customerToSend);
			try {
				const res = await axios.post('/api/template', customerToSend);
				console.log('customer', customerToSend);
				console.log(res);
			} catch (error) {
				console.log('nahi hua post customer');
			}
		} else {
			console.log('customer nahi gaya');
		}
		if (adminToSend.topic && adminToSend.adminTemplate !== '``' && adminToSend.adminTemplate !== '') {
			console.log(adminToSend);
			try {
				const res = await axios.post('/api/template', adminToSend);
				console.log('admin', adminToSend);
				console.log(res);
			} catch (error) {
				console.log('nahi hua post admin');
			}
		} else {
			console.log('admin nahi gaya');
		}
	};
	let tempObj = {
		topic: '',
		template: '',
		audience: ''
	};
	const convertData = (param) => {
		var inputData = param.text;
		if (inputData !== '' && inputData !== null) {
			inputData = inputData.replace(/(^\s*)|(\s*$)/gi, '');
			inputData = inputData.replace(/[ ]{2,}/gi, ' ');
			inputData = inputData.replace(/\n /, '\n');
			for (let i = 0; i < inputData.length; i++) {
				inputData = inputData.replace(' ', '%20');
				inputData = inputData.replace('(', '${');
				inputData = inputData.replace(')', '}');
				inputData = inputData.replace('\n', '%0A');
			}
		}
		showOutput(inputData);
	};
	const showOutput = (parameter) => {
		parameter = `\`${parameter}\``;
		tempObj.template = parameter;
		sendTemplate(tempObj);
	};
	/////////////////////////////////
	function myFunction1() {
		tempObj.topic = topics.topic;
		tempObj.audience = 'customer';
		if (tempObj.topic) {
			convertData({
				text: template1
			});
		}
		var x = document.getElementById('snackbar');
		x.className = 'show';
		setTimeout(function() {
			x.className = x.className.replace('show', '');
		}, 2000);
	}
	const [ template1, setTemplate1 ] = useState('');
	const handleTemplate1 = useCallback((newValue) => setTemplate1(newValue), []);
	/////////////////////////22
	function myFunction2() {
		tempObj.topic = topics.topic;
		tempObj.audience = 'admin';
		if (tempObj.topic) {
			convertData({
				text: template2
			});
		}
		var x = document.getElementById('snackbar');
		x.className = 'show';
		setTimeout(function() {
			x.className = x.className.replace('show', '');
		}, 2000);
	}
	const [ template2, setTemplate2 ] = useState('');
	const handleTemplate2 = useCallback((newValue) => setTemplate2(newValue), []);
	const getOption = () => {
		axios.get('/api/template').then((res) => {
			console.log(res.data);
			try {
				res.data.forEach((element) => {
					if (element.topic === 'orders/create') {
						let inputData = element.customer;
						for (let i = 0; i < inputData.length; i++) {
							inputData = inputData.replace('%20', ' ');
							inputData = inputData.replace('${', '(');
							inputData = inputData.replace('}', ')');
							inputData = inputData.replace('`', '');
						}
						let inputAdmin = element.admin;
						for (let i = 0; i < inputAdmin.length; i++) {
							inputAdmin = inputAdmin.replace('%20', ' ');
							inputAdmin = inputAdmin.replace('${', '(');
							inputAdmin = inputAdmin.replace('}', ')');
							inputAdmin = inputAdmin.replace('`', '');
						}
						setTemplate1(inputData);
						setTemplate2(inputAdmin);
					}
				});
			} catch (error) {
				setTemplate1('');
				setTemplate2('');
				console.error(error);
			}
		});
	};
	useEffect(() => {
		getOption();
	}, []);
	return (
		<Fragment>
			<div id='snackbar'> Template Updated for {topics.topic} </div>
			<div className='bog col-md-12 mb-5'>
				<div className='butti ' title='orders/create' onClick={topicHandler}>
					Orders / create{' '}
				</div>
				<div className='butt ' title='orders/cancelled' onClick={topicHandler}>
					Orders / cancelled{' '}
				</div>{' '}
				<div className='butt ' title='orders/fulfilled' onClick={topicHandler}>
					Orders / fulfilled{' '}
				</div>{' '}
			</div>{' '}
			<Layout>
				<Layout.AnnotatedSection
					title='Customer Template'
					description='Customer will be notified through sms by selecting Notify Admin. Enclose every variable with &#39; (&nbsp; ) &#39;.'
				>
					<Card>
						<div
							style={{
								padding: '1.311rem'
							}}
						>
							<TextField
								label='Template'
								value={template1}
								onChange={handleTemplate1}
								multiline
								helpText={'Available Variables :-' + topics.topicVariables}
							/>{' '}
							<br />
							<button
								onClick={() => {
									myFunction1();
								}}
								style={{
									height: '34px'
								}}
								className='button-shopify'
							>
								Save{' '}
							</button>{' '}
						</div>{' '}
					</Card>{' '}
				</Layout.AnnotatedSection>
				<Layout.AnnotatedSection
					title='Admin Template'
					description='Admin will be notified through sms by selecting Notify Admin. Enclose every variable with &#39; (&nbsp; ) &#39;.'
				>
					<Card>
						<div
							style={{
								padding: '1.311rem'
							}}
						>
							<TextField
								label='Template'
								value={template2}
								onChange={handleTemplate2}
								multiline
								helpText='Available Variables: name'
							/>
							<br />
							<button
								onClick={() => {
									myFunction2();
								}}
								style={{
									height: '34px'
								}}
								className='button-shopify'
							>
								Save{' '}
							</button>{' '}
						</div>{' '}
					</Card>{' '}
				</Layout.AnnotatedSection>
				<div
					id='snackbar'
					style={{
						zIndex: '999'
					}}
				>
					Abandan Updated {' '}
				</div>{' '}
			</Layout>{' '}
		</Fragment>
	);
}
