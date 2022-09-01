import React, { useState, useEffect } from 'react'

//Chart.JS
import Chart from './Chart'

//Componentes
import BasicModal from './BasicModal'
import Selector from './Selector'
import Input from './Input'

//MUI
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import TextField from '@mui/material/TextField'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

//funciones
import { formato, seleccionYears, seleccionIntervalo } from '../utils/functions'

const baseUrl = 'https://api.coincap.io/v2/assets'

const MyApi = () => {
    const year = new Date().getFullYear()
    const today = new Date()

    const [indicador, setIndicador] = useState('bitcoin')
    const [valoresIndicador, setValoresIndicador] = useState([])
    const [seleccionadores, setSeleccionadores] = useState([])
    const [cantidadDatos, setCantidadDatos] = useState(10)
    const [years, setYears] = useState(year)
    const [fecha, setFecha] = useState(today)
    const [intervalo, setIntervalo] = useState('d1')
    const [toggle, setToggle] = useState('year') // Selección año / fecha
    const [loading, setLoading] = useState(true) // Manejo del modal y progress bar
    const [error, setError] = useState(false) // Errores del servidor

    //Obtener todos los datos de la api para generar la selección dinámica de indicadores
    useEffect(() => {
        const fetchTodosLosDatos = async () => {
            try {
                const response = await fetch(baseUrl, {
                    method: 'GET',
                    redirect: 'follow',
                })

                if (!response.ok || !response) {
                    throw new Error('No pudimos conectarnos con el servidor')
                }

                const { data } = await response.json()

                if (data) {
                    const select = []
                    for (const d of data) {
                        select.push({
                            nombre: d['name'],
                            value: d['id'],
                        })
                    }

                    setSeleccionadores(select)
                }
            } catch (error) {
                setError(true)
            }
        }

        fetchTodosLosDatos()
    }, [])

    //Obtener valores según el indicador del presente año o según fecha exacta
    useEffect(() => {
        const fetchDatosIndicador = async () => {
            setLoading(true)
            let mill = Math.floor(new Date(years.toString()).getTime())
            let now = Math.floor(new Date(new Date()).getTime())
            try {
                let url
                if (toggle === 'year' && intervalo === 'd1') {
                    url = `https://api.coincap.io/v2/assets/${indicador}/history?interval=${intervalo}&start=${mill}&end=${now}`
                } else {
                    url = `https://api.coincap.io/v2/assets/${indicador}/history?interval=${intervalo}`
                }

                const response = await fetch(url)

                if (!response.ok || !response) {
                    throw new Error('No pudimos conectarnos con el servidor')
                }
                const { data } = await response.json()

                let valorIndicador = []
                if (toggle === 'year') {
                    data.forEach(d =>
                        valorIndicador.push({
                            serie: d.priceUsd,
                            fecha: d.date,
                        })
                    )
                    setValoresIndicador(valorIndicador)
                } else {
                    setValoresIndicador({})
                }

                setLoading(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchDatosIndicador()
    }, [indicador, years, toggle, fecha, intervalo])

    const cantidadHandler = event => {
        setCantidadDatos(event.target.value)
    }

    const intervaloHandler = event => {
        setIntervalo(event.target.value)
        if (event.target.value !== 'd1') {
            setYears(2022)
        }
    }

    if (loading && !error) {
        return (
            <BasicModal
                mensaje="Cargando datos del indicador..."
                subtitulo="Esto puede tardar un par de minutos"
                display={true} // display del progress bar
            />
        )
    }

    if (error && !loading) {
        return (
            <BasicModal
                mensaje="Error cargando los datos"
                subtitulo="Tuvimos problemas con el servidor"
                display={false}
            />
        )
    }

    if (!loading && !error) {
        console.log(intervalo)
        return (
            <div className="horizontal">
                <div className="vertical">
                    <Selector
                        selectores={seleccionadores}
                        indicadorHandler={event => setIndicador(event.target.value)}
                        indicador={indicador}
                        label="Indicador"
                    />
                    <Selector
                        selectores={seleccionYears(year, 10)}
                        indicadorHandler={event => setYears(event.target.value)}
                        indicador={years}
                        label="Año"
                        disabled={intervalo === 'd1' ? false : true}
                    />
                    <Selector
                        selectores={seleccionIntervalo()}
                        indicadorHandler={intervaloHandler}
                        indicador={intervalo}
                        label="Intervalo"
                    />
                    <Input
                        cantidadHandler={cantidadHandler}
                        cantidadDatos={cantidadDatos}
                        maxDatos={valoresIndicador.length}
                    />
                </div>
                <div className="chart">
                    <Chart
                        year={years}
                        indicador={indicador}
                        valoresIndicador={valoresIndicador}
                        cantidadDatos={cantidadDatos}
                    />
                </div>
            </div>
        )
    }
}

export default MyApi
