import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Card } from '@shopify/polaris';
import Baar from './analytics/Baar';
import Piee from './analytics/piee';
import Linee from './analytics/Linee';
function Dashboard() {
	const [ bar, setBar ] = useState('');
	const [ line, setLine ] = useState('');
	const [ pie, setPie ] = useState('');
	const getDash = async () => {
		try {
			let res = await axios.get('/api/dashboard/');
			console.log(res);
			let { convertedFolowUpPrice, convertedFolowUpCount, clickThroughCount } = res.data;
			setBar(convertedFolowUpCount);
			setLine(clickThroughCount);
			setPie(convertedFolowUpPrice);
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		getDash();
	}, []);
	return (
		<Layout>
			<Layout.AnnotatedSection
				title='Click Through Rate'
				description='Number of clicked abandan links from followUp message will appear here, according to their order.'
			>
				<Card sectioned>
					<Linee ldata={line} />
				</Card>
			</Layout.AnnotatedSection>
			<Layout.AnnotatedSection
				title='Converted FollowUp'
				description='All the converted sales from followUp message will appear here, according to their order.'
			>
				<Card sectioned>
					<Baar dataa={bar} />
				</Card>
			</Layout.AnnotatedSection>
			<Layout.AnnotatedSection
				title='Converted Sales'
				description='Total amount of converted sales from followUp message will appear here, according to their order. Price in Rupees.'
			>
				<Card sectioned>
					<Piee pdata={pie} />
				</Card>
			</Layout.AnnotatedSection>
		</Layout>
	);
}
export default Dashboard;
