import React, { useState, useEffect } from 'react';

import Chart from './Chart';

const baseUrl = 'https://mindicador.cl/api';

const MyApi = () => {
	const [indicador, setIndicador] = useState('bitcoin');
	const [valores, setValores] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchDatosIndicador = async () => {
			const response = await fetch(`${baseUrl}/${indicador}/2022`);
			const data = await response.json();

			const arr = data.serie.reverse().slice(-30);

			setLoading(false);
			setValores(arr);

			console.log(arr);
		};

		fetchDatosIndicador();
	});

	const listaValores = valores.map((valor) => <li>{valor.valor}</li>);
	return (
		<div>
			<ul>{listaValores}</ul>
			<Chart />
		</div>
	);
};

export default MyApi;
