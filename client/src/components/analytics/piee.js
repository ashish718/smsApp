import React from 'react';

import { Pie } from 'react-chartjs-2';
export default function Piee({ pdata }) {
	const state = {
		labels: [ 'First', 'Second', 'Third', 'Fourth' ],
		datasets: [
			{
				label: 'Amount of Sales',
				data: pdata,
				backgroundColor: [ '#5C6AC4', '#50B83C', '#006FBB', '#F49342' ],
				hoverBackgroundColor: [ '#5C3AC4', '#24930e', '#005289', '#e07721' ],

				borderAlign: 'inner',
				borderWidth: 0.1
			}
		]
	};

	return (
		<div>
			<Pie
				data={state}
				options={{
					title: {
						display: true,
						text: 'Converted Earnings',
						fontSize: 15
					},
					legend: {
						display: true,
						position: 'right'
					}
				}}
			/>
		</div>
	);
}
