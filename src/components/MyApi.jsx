import React, { useState, useEffect } from 'react';

//Chart.JS
import Chart from './Chart';

//Componentes
import BasicModal from './BasicModal';
import Selector from './Selector';
import Input from './Input';

//MUI
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

//funciones
import { formato, seleccionYears } from '../utils/functions';

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
	const [toggle, setToggle] = useState('year'); // Selección año / fecha
	const [loading, setLoading] = useState(true); // Manejo del modal y progress bar
	const [error, setError] = useState(false); // Errores del servidor

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

	//Obtener valores según el indicador del presente año o según fecha exacta
	useEffect(() => {
		const fetchDatosIndicador = async () => {
			setLoading(true);

			try {
				let url;
				if (toggle === 'year') {
					url = `${baseUrl}/${indicador}/${years}`;
				} else {
					url = `${baseUrl}/${indicador}/${formato(fecha)}`;
				}

				const response = await fetch(url);

				if (!response.ok || !response) {
					throw new Error('No pudimos conectarnos con el servidor');
				}
				const { serie } = await response.json();

				if (toggle === 'year') {
					setValoresIndicador(serie.reverse());
				} else {
					setValoresIndicador(serie);
				}

				setLoading(false);
			} catch (error) {
				setError(true);
				setLoading(false);
			}
		};

		fetchDatosIndicador();
	}, [indicador, years, toggle, fecha]);

	const indicadorHandler = (event) => {
		setIndicador(event.target.value);
	};
	const yearsHandler = (event) => {
		setYears(event.target.value);
	};

	const cantidadHandler = (event) => {
		setCantidadDatos(event.target.value);
	};

	const toggleHandler = (event, newToggle) => {
		setToggle(newToggle);
	};

	const dateHandler = (event) => {
		setFecha(event._d);
	};

	if (loading && !error) {
		return (
			<BasicModal
				mensaje='Cargando datos del indicador...'
				subtitulo='Esto puede tardar un par de minutos'
				display={true} // display del progress bar
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

	if (!loading && !error) {
		return (
			<div className='horizontal'>
				<div className='vertical'>
					<ToggleButtonGroup
						color='primary'
						value={toggle}
						exclusive
						onChange={toggleHandler}
						aria-label='Platform'
					>
						<ToggleButton value='year'>Año</ToggleButton>
						<ToggleButton value='fecha'>Fecha</ToggleButton>
					</ToggleButtonGroup>
					{toggle === 'year' && (
						<>
							<Selector
								selectores={seleccionYears(year, 10)}
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
					{toggle === 'fecha' && (
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
					{toggle === 'year' && (
						<Chart
							year={years}
							indicador={indicador}
							valoresIndicador={valoresIndicador}
							cantidadDatos={cantidadDatos}
						/>
					)}
					{toggle === 'fecha' && (
						<Card sx={{ minWidth: 275, m: 25 }}>
							<CardContent>
								<Typography
									sx={{ fontSize: 14 }}
									color='text.secondary'
									gutterBottom
								>
									Valor del {indicador} al {formato(fecha)}
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

export default MyApi;
