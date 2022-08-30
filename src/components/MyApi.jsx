import React, { useState, useEffect } from 'react';

import Chart from './Chart';
import BasicModal from './BasicModal';
import Selector from './Selector';
import Input from './Input';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const baseUrl = 'https://mindicador.cl/api';

const MyApi = () => {
	const year = [new Date().getFullYear()];
	const today = new Date();

	const [indicador, setIndicador] = useState('bitcoin');
	const [valoresIndicador, setValoresIndicador] = useState([]);
	const [seleccionadores, setSeleccionadores] = useState([]);
	const [cantidadDatos, setCantidadDatos] = useState(10);
	const [years, setYears] = useState(year);
	const [fecha, setFecha] = useState(today);
	const [alignment, setAlignment] = useState('year');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

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
				setLoading(false);
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
				let url;
				if (alignment === 'year') {
					url = `${baseUrl}/${indicador}/${years}`;
				} else {
					url = `${baseUrl}/${indicador}/${format(fecha)}`;
				}

				const response = await fetch(url);

				if (!response.ok || !response) {
					throw new Error('No pudimos conectarnos con el servidor');
				}
				const data = await response.json();

				if (alignment === 'year') {
					setValoresIndicador(data.serie.reverse());
				} else {
					setValoresIndicador(data.serie);
				}

				setLoading(false);
			} catch (error) {
				setLoading(false);
				setError(true);
			}
		};

		fetchDatosIndicador();
	}, [indicador, years, alignment, fecha]);

	const indicadorHandler = (event) => {
		setIndicador(event.target.value);
	};
	const yearsHandler = (event) => {
		setYears(event.target.value);
	};

	const cantidadHandler = (event) => {
		setCantidadDatos(event.target.value);
	};

	const toggleHandler = (event, newAlignment) => {
		setAlignment(newAlignment);
	};

	const dateHandler = (event) => {
		setFecha(event._d);
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

	let min = year - 11;
	const listaYears = [];
	for (let i = year; i >= min; i--) {
		listaYears.push(+i);
	}

	if (!loading && !error) {
		return (
			<div className='horizontal'>
				<div className='vertical'>
					<ToggleButtonGroup
						color='primary'
						value={alignment}
						exclusive
						onChange={toggleHandler}
						aria-label='Platform'
					>
						<ToggleButton value='year'>Año</ToggleButton>
						<ToggleButton value='fecha'>Fecha</ToggleButton>
					</ToggleButtonGroup>
					{alignment === 'year' && (
						<>
							<Selector
								selectores={listaYears}
								indicadorHandler={yearsHandler}
								indicador={years}
								label='Año'
							/>
							<Selector
								selectores={seleccionadores}
								indicadorHandler={indicadorHandler}
								indicador={indicador}
								label='Indicador'
							/>
							<Input
								cantidadHandler={cantidadHandler}
								cantidadDatos={cantidadDatos}
								maxDatos={valoresIndicador.length}
							/>
						</>
					)}
					{alignment === 'fecha' && (
						<>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<DesktopDatePicker
									label='Fecha'
									inputFormat='MM/DD/YYYY'
									value={fecha}
									onChange={dateHandler}
									renderInput={(params) => <TextField {...params} />}
								/>
							</LocalizationProvider>
							<Selector
								selectores={seleccionadores}
								indicadorHandler={indicadorHandler}
								indicador={indicador}
								label='Indicador'
							/>
						</>
					)}
				</div>
				<div className='chart'>
					{alignment === 'year' && (
						<Chart
							year={years}
							indicador={indicador}
							valoresIndicador={valoresIndicador}
							cantidadDatos={cantidadDatos}
						/>
					)}
					{alignment === 'fecha' && (
						<Card sx={{ minWidth: 275, m: 25 }}>
							<CardContent>
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									Valores {indicador} {format(fecha)}
								</Typography>
								<Typography
									variant='h5'
									component='div'
								>
									{valoresIndicador.length > 0
										? '$' + valoresIndicador[0].valor
										: 'Lo sentimos, los datos aun no han sido actualizados para esta fecha'}
								</Typography>
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		);
	}
};

function format(inputDate) {
	let date, month, year;

	date = inputDate.getDate();
	month = inputDate.getMonth() + 1;
	year = inputDate.getFullYear();

	date = date.toString().padStart(2, '0');

	month = month.toString().padStart(2, '0');

	return `${date}-${month}-${year}`;
}

export default MyApi;
