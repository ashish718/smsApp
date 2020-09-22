import React, { useEffect, useState } from 'react';
import { DescriptionList, Stack, Layout, Card, Button } from '@shopify/polaris';
import axios from 'axios';
export default function History() {
	const [ history, setHistory ] = useState([]);
	const smsHistory = async () => {
		try {
			let response = await axios.get('/api/history');
			let filteredHistory = [];
			const resp = response.data;
			resp.forEach((element) => {
				if (element) {
					filteredHistory.push(element);
				}
			});
			setHistory(filteredHistory);
		} catch (error) {
			console.error(error, 'cannot get response sms history');
			setHistory('');
		}
	};
	useEffect(() => {
		smsHistory();
		smsCount();
	}, []);
	const [ smsLeft, setSmsLeft ] = useState(0);
	const smsCount = async () => {
		try {
			let response = await axios.get('/api/smsCount/');
			setSmsLeft(response.data);
		} catch (error) {
			console.error(error, 'cannot get response smscounnt');
			setSmsLeft(0);
		}
	};
	const buySms = () => {
		alert('Please contact Us: +917827537259');
	};
	return (
		<Layout>
			<div
				style={{
					marginTop: '18px'
				}}
			>
				<Card title='Remaining SMS'>
					<Card.Section>
						<Stack spacing='loose' vertical>
							<h1
								style={{
									fontSize: '14px'
								}}
							>
								You have only {' '}
								{smsLeft > 100 ? (
									<span
										style={{
											color: 'green',
											fontWeight: '600'
										}}
									>
										{' '}
										{smsLeft}{' '}
									</span>
								) : (
									<span
										style={{
											color: 'red',
											fontWeight: '600'
										}}
									>
										{' '}
										{smsLeft}{' '}
									</span>
								)}{' '}
								SMS left.{' '}
							</h1>{' '}
							<p>
								Character Counts and SMS units are based on current content and may vary after filling actual variables
								value.You can recharge your SMS manually also.{' '}
							</p>
							<Button onClick={buySms} primary>
								Buy More SMS{' '}
							</Button>{' '}
						</Stack>{' '}
					</Card.Section>{' '}
				</Card>
				<Card title='  SMS HISTORY'>
					<Card.Section>
						<DescriptionList items={history} />
						<Button
							onClick={() => {
								console.log('It will take time');
							}}
							primary
						>
							More SMS
						</Button>
					</Card.Section>{' '}
				</Card>{' '}
			</div>{' '}
		</Layout>
	);
}
