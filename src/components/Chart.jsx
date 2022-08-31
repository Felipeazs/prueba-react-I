import React from 'react';

import { etiqueta } from '../utils/functions';

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

import chartTrendline from 'chartjs-plugin-trendline';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
ChartJS.register(chartTrendline);
ChartJS.defaults.font.size = 16;

const Chart = ({ indicador, valoresIndicador, cantidadDatos, year }) => {
	valoresIndicador = valoresIndicador.slice(`-${cantidadDatos}`);

	const labels = valoresIndicador.map((ind) => ind.fecha.substring(5, 10));

	let trendline = {
		colorMin: 'red',
		colorMax: 'green',
		lineStyle: 'dotted',
		width: 2,
		projection: false,
	};

	if (cantidadDatos <= 1) {
		trendline = null;
	}

	const data = {
		labels,
		datasets: [
			{
				label: indicador,
				data: valoresIndicador.map((ind) => ind.valor),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				trendlineLinear: trendline,
			},
		],
	};

	const options = {
		responsive: true,
		scales: {
			y: {
				title: {
					display: true,
					text: `Valor (${etiqueta(indicador)})`,
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
				text: `Indicadores ${
					indicador === 'libra_cobre' || indicador === 'tasa_desempleo' ? 'de la' : 'del'
				} ${indicador} - últimos ${
					valoresIndicador.length
				} datos adquiridos durante el ${year}`,
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
