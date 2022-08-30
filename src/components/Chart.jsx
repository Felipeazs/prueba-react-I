import React from 'react';

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Chart = ({ indicador, valoresIndicador, year }) => {
	const labels = valoresIndicador.map((indicador) => indicador.fecha.substring(5, 10));

	const data = {
		labels,
		datasets: [
			{
				label: indicador,
				data: valoresIndicador.map((indicador) => indicador.valor),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
			},
		],
	};

	const options = {
		responsive: true,
		scales: {
			y: {
				title: {
					display: true,
					text: 'Valor ($ CLP)',
					font: {
						size: '15px',
						weight: '700',
					},
				},
			},
			x: {
				title: {
					display: true,
					text: 'Fecha (mes - día)',
					font: {
						size: '15px',
						weight: '700',
					},
				},
			},
		},
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: true,
				text: `Gráfico indicadores - últimos ${valoresIndicador.length} datos adquiridos del ${year}`,
				font: {
					size: '20px',
				},
			},
		},
	};

	return (
		<Line
			options={options}
			data={data}
		/>
	);
};

export default Chart;
