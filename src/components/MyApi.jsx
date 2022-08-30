import React, { useState, useEffect } from 'react';

import Chart from './Chart';
import BasicModal from './BasicModal';
import Selector from './Selector';

const baseUrl = 'https://mindicador.cl/api';

const MyApi = () => {
	const [indicador, setIndicador] = useState('bitcoin');
	const [valoresIndicador, setValoresIndicador] = useState([]);
	const [seleccionadores, setSeleccionadores] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	const year = new Date().getFullYear();

	//Obtener todos los datos de la api para generar la selección dinámica de indicadores
	useEffect(() => {
		const fetchTodosLosDatos = async () => {
			setLoading(true);
			try {
				const response = await fetch(baseUrl);

				if (!response.ok || !response) {
					throw new Error('No pudimos conectarnos con el servidor');
				}

				const data = await response.json();

				if (data) {
					const select = [];
					for (const d in data) {
						if (data[d]['codigo']) {
							select.push(data[d]['codigo']);
						}
					}
					setSeleccionadores(select);
				}
			} catch (error) {
				setLoading(false);
				setError(true);
			}
		};

		fetchTodosLosDatos();
	}, []);

	//Obtener valores según el indicador del presente año
	useEffect(() => {
		const fetchDatosIndicador = async () => {
			setLoading(true);

			try {
				const response = await fetch(`${baseUrl}/${indicador}/${year}`);

				if (!response.ok || !response) {
					throw new Error('No pudimos conectarnos con el servidor');
				}
				const data = await response.json();

				const lastData = data.serie.reverse().slice(-30);

				setLoading(false);
				setValoresIndicador(lastData);
			} catch (error) {
				setLoading(false);
				setError(true);
			}
		};

		fetchDatosIndicador();
	}, [indicador]);

	/**
	 * It sets the value of the indicador to the value of the event.target.value.
	 */
	const indicadorHandler = (event) => {
		setIndicador(event.target.value);
	};

	if (loading && !error) {
		return (
			<BasicModal
				mensaje='Cargando datos del indicador...'
				subtitulo='Esto puede tardar un par de minutos'
				display={true}
			/>
		);
	}

	if (error && !loading) {
		return (
			<BasicModal
				mensaje='Error cargando los datos'
				subtitulo='Tuvimos problemas con el servidor'
				display={false}
			/>
		);
	}

	return (
		<div className='horizontal'>
			<div>
				<Selector
					selectores={seleccionadores}
					indicadorHandler={indicadorHandler}
					indicador={indicador}
				/>
			</div>
			<div className='chart'>
				<Chart
					year={year}
					indicador={indicador}
					valoresIndicador={valoresIndicador}
				/>
			</div>
		</div>
	);
};

export default MyApi;
