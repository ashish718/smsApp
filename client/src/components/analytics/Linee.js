import React from 'react';

import { Line } from 'react-chartjs-2';
export default function Linee({ ldata }) {
	const state = {
		labels: [ 'First', 'Second', 'Third', 'Fourth' ],
		datasets: [
			{
				label: 'CTR',
				data: ldata,
				fill: true,
				lineTension: 0.5,
				lineColor: '#3A5BD6',
				backgroundColor: '#5C6AC4',
				borderColor: '#3A5BD6',
				borderWidth: 1
			}
		]
	};

	return (
		<div>
			<Line
				data={state}
				options={{
					title: {
						display: true,
						text: 'Number of Click on followUp message',
						fontSize: 15
					},
					legend: {
						display: true,
						position: 'right'
					},
					scales: {
						yAxes: [
							{
								ticks: {
									beginAtZero: true
								}
							}
						],
						xAxes: [
							{
								gridLines: {
									display: false
								}
							}
						]
					}
				}}
			/>{' '}
		</div>
	);
}
