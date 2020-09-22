import React, { Fragment, useEffect, useCallback, useState } from 'react';
import { Card, Layout, Heading, Button, Checkbox, Form, TextField } from '@shopify/polaris';
import axios from 'axios';

function myFunction() {
	var x = document.getElementById('snackbar');
	x.className = 'show';
	setTimeout(function() {
		x.className = x.className.replace('show', '');
	}, 2000);
}
export default function Settings() {
	const [ adminPhone, setAdminPhone ] = useState('');
	const handleChangePhone = useCallback((newNumber) => setAdminPhone(newNumber), []);

	const [ senderID, setSenderID ] = useState('ALERTS');
	const handleChangeSenderID = useCallback((newValue) => setSenderID(newValue), []);

	const [ orderCreateCustomer, setOrderCreateCustomer ] = useState(false);
	const handleOrderCreateCustomer = useCallback((value) => setOrderCreateCustomer(value), []);

	const [ orderCreateAdmin, setOrderCreateAdmin ] = useState(false);
	const handleOrderCreateAdmin = useCallback((value) => setOrderCreateAdmin(value), []);

	const [ orderCancelledCustomer, setOrderCancelledCustomer ] = useState(false);
	const handleOrderCancelledCustomer = useCallback((value) => setOrderCancelledCustomer(value), []);

	const [ orderCancelledAdmin, setOrderCancelledAdmin ] = useState(false);
	const handleOrderCancelledAdmin = useCallback((value) => setOrderCancelledAdmin(value), []);

	const [ orderFulfilledCustomer, setOrderFulfilledCustomer ] = useState(false);
	const handleOrderFulfilledCustomer = useCallback((value) => setOrderFulfilledCustomer(value), []);

	const [ orderFulfilledAdmin, setOrderFulfilledAdmin ] = useState(false);
	const handleOrderFulfilledAdmin = useCallback((value) => setOrderFulfilledAdmin(value), []);

	const getOption = async () => {
		const res = await axios.get('/api/option/');
		console.log(res);
		setAdminPhone(res.data['admin no']);
		setSenderID(res.data['sender id']);
		setOrderCreateCustomer(res.data['orders/create customer']);
		setOrderCreateAdmin(res.data['orders/create admin']);
		setOrderCancelledCustomer(res.data['orders/cancelled customer']);
		setOrderCancelledAdmin(res.data['orders/cancelled admin']);
		setOrderFulfilledAdmin(res.data['orders/fulfilled admin']);
		setOrderFulfilledCustomer(res.data['orders/fulfilled customer']);
	};

	let preference = {
		'admin no': adminPhone,
		'sender id': senderID,
		'orders/create customer': orderCreateCustomer,
		'orders/create admin': orderCreateAdmin,
		'orders/cancelled customer': orderCancelledCustomer,
		'orders/cancelled admin': orderCancelledAdmin,
		'orders/fulfilled customer': orderFulfilledCustomer,
		'orders/fulfilled admin': orderFulfilledAdmin
	};

	const handleSubmit = async () => {
		console.log('preference', preference);

		try {
			const res = await axios.post('/api/myaction/', preference);
			console.log(res);
		} catch (err) {
			console.error(err);
			console.log('error aa raha hai');
		}
	};

	useEffect(() => {
		getOption();
	}, []);
	return (
		<Fragment>
			<Form onSubmit={handleSubmit}>
				<div style={{ marginBottom: '3rem' }}>
					<Card sectioned>
						<h4>Rate :- 43 paisa per SMS only</h4>
					</Card>
				</div>

				<Layout>
					<Layout.AnnotatedSection
						title='Admin Phone No.'
						description='Admin will be notify on this no. by selecting Notify Admin. You can add number only of 10 digits. Please don&#39;t add &#39; 0 &#39; before your phone number. '
					>
						<Card sectioned>
							<div style={{ padding: '3rem' }}>
								<TextField
									label='Admin Phone No.'
									type='text'
									maxLength='10'
									onChange={handleChangePhone}
									value={adminPhone}
									showCharacterCount
								/>
							</div>
						</Card>
					</Layout.AnnotatedSection>
					<Layout.AnnotatedSection
						title='Sender ID'
						description='Sender ID is the name or number which appears on the mobile phone as the sender of a SMS. Sender ID will be maximum of 6 Characters. Please avoid using special characters like &#39; @ , # , $ , % , ^ , & , * , _ , - , &#39; '
					>
						<Card sectioned>
							<div style={{ padding: '3rem' }}>
								<TextField
									label='Sender ID'
									type='text'
									onChange={handleChangeSenderID}
									maxLength='6'
									value={senderID}
									showCharacterCount
									disabled
								/>
								<small>If you want to change sender id then email us to <a href="">a.modi.abhishek@gmail.com</a></small>
							</div>
						</Card>
					</Layout.AnnotatedSection>
					<Layout.AnnotatedSection
						title='Notification Prefrence'
						description='Admin and Customer will be notified according to by selecting Notify Admin. Select notification prefernce for orders create, orders fulfilled and orders cancelled.'
					>
						<Card sectioned>
							<div style={{ padding: '2rem' }}>
								<p style={{ fontSize: '17px' }}>Orders</p>
								<hr />

								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div style={{ width: '10rem' }}>
										<Heading>Create </Heading>
									</div>
									<Checkbox
										label='Notify Customer'
										checked={orderCreateCustomer}
										onChange={handleOrderCreateCustomer}
									/>

									<Checkbox label='Notify Admin' checked={orderCreateAdmin} onChange={handleOrderCreateAdmin} />
								</div>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div style={{ width: '10rem' }}>
										<Heading>Cancelled </Heading>
									</div>

									<Checkbox
										label='Notify Customer'
										checked={orderCancelledCustomer}
										onChange={handleOrderCancelledCustomer}
									/>

									<Checkbox label='Notify Admin' checked={orderCancelledAdmin} onChange={handleOrderCancelledAdmin} />
								</div>

								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div style={{ width: '10rem' }}>
										<Heading>Fullfilled </Heading>
									</div>

									<Checkbox
										label='Notify Customer'
										checked={orderFulfilledCustomer}
										onChange={handleOrderFulfilledCustomer}
									/>

									<Checkbox label='Notify Admin' checked={orderFulfilledAdmin} onChange={handleOrderFulfilledAdmin} />
								</div>
							</div>
						</Card>
					</Layout.AnnotatedSection>
				</Layout>

				<br />
				<div style={{ textAlign: 'right' }}>
					<Button onClick={myFunction} submit primary>
						Save
					</Button>
				</div>
				<div id='snackbar'>Settings Updated </div>
			</Form>
		</Fragment>
	);
}
