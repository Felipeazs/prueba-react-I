import React, { useState, useEffect } from 'react';

import Chart from './Chart';

const baseUrl = 'https://mindicador.cl/api';

const MyApi = () => {
	const [indicador, setIndicador] = useState('bitcoin');
	const [valoresIndicador, setValoresIndicador] = useState([]);
	const [seleccionadores, setSeleccionadores] = useState([]);
	const [loading, setLoading] = useState(true);

	//Obtener todos los datos de la api para generar la selección dinámica de indicadores
	useEffect(() => {
		const fetchTodosLosDatos = async () => {
			const response = await fetch(baseUrl);
			const data = await response.json();

			if (data) {
				const sel = [];
				for (const d in data) {
					if (data[d]['codigo']) {
						sel.push(data[d]['codigo']);
					}
				}
				setSeleccionadores(sel);
			}
		};

		fetchTodosLosDatos();
	}, []);

	//Obtener valores según el indicador del presente año
	useEffect(() => {
		const fetchDatosIndicador = async () => {
			setLoading(true);
			const anio = new Date().getFullYear();
			const response = await fetch(`${baseUrl}/${indicador}/${anio}`);
			const data = await response.json();

			const ultimosDatos = data.serie.reverse().slice(-30);

			setLoading(false);
			setValoresIndicador(ultimosDatos);
		};

		fetchDatosIndicador();
	}, [indicador]);

	const indicadorHandler = (event) => {
		setIndicador(event.target.value);
	};

	const listaSeleccionadores = seleccionadores.map((seleccionador, i) => (
		<option
			value={seleccionador}
			key={i}
		>
			{seleccionador}
		</option>
	));

	return (
		<div>
			<div>
				<label htmlFor='indicador'>Ingresa el indicador</label>
				<select
					name='indicador'
					id='indicador'
					value={indicador}
					onChange={indicadorHandler}
				>
					{listaSeleccionadores}
				</select>
			</div>
			{loading && <h2>Cargando datos del indicador...</h2>}
			<Chart indicadores={valoresIndicador} />
		</div>
	);
};

export default MyApi;
