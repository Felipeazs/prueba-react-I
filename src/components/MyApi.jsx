import React, { useState, useEffect } from 'react'

//Chart.JS
import Chart from './Chart'

//Componentes
import BasicModal from './BasicModal'
import Selector from './Selector'
import Input from './Input'

//funciones
import { seleccionYears, seleccionIntervalo } from '../utils/functions'

//MUI
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const baseUrl = 'https://api.coincap.io/v2/assets'

const MyApi = () => {
    const year = new Date().getFullYear()

    const [indicador, setIndicador] = useState({ nombre: 'Bitcoin', value: 'bitcoin' })
    const [valoresIndicador, setValoresIndicador] = useState([])
    const [seleccionadores, setSeleccionadores] = useState([])
    const [cantidadDatos, setCantidadDatos] = useState(0)
    const [years, setYears] = useState({ value: year })
    const [intervalo, setIntervalo] = useState({ nombre: 'Dia', value: 'd1' })
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
            let from = Math.floor(new Date(years.value.toString()).getTime())
            let now = Math.floor(new Date(new Date()).getTime())
            try {
                let url
                if (intervalo.value === 'd1') {
                    url = `https://api.coincap.io/v2/assets/${indicador.value}/history?interval=${intervalo.value}&start=${from}&end=${now}`
                } else {
                    url = `https://api.coincap.io/v2/assets/${indicador.value}/history?interval=${intervalo.value}`
                }

                const response = await fetch(url)

                if (!response.ok || !response) {
                    throw new Error('No pudimos conectarnos con el servidor')
                }
                const { data } = await response.json()

                let valorIndicador = []

                data.forEach(d =>
                    valorIndicador.push({
                        serie: d.priceUsd,
                        fecha: d.date,
                    })
                )
                setValoresIndicador(valorIndicador)
                setCantidadDatos(valorIndicador.length)

                setLoading(false)
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }

        fetchDatosIndicador()
    }, [indicador, years, intervalo])

    const intervaloHandler = event => {
        setIntervalo({ nombre: event.target.name, value: event.target.value })
        if (event.target.value !== 'd1') {
            setYears({ value: new Date().getFullYear() })
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
        return (
            <div className="horizontal">
                <div className="vertical">
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Selector
                                selectores={seleccionadores}
                                indicadorHandler={event =>
                                    setIndicador({
                                        value: event.target.value,
                                        nombre: event.target.name,
                                    })
                                }
                                indicador={indicador}
                                label="Indicador"
                            />
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Selector
                                selectores={seleccionYears(year, 10)}
                                indicadorHandler={event => {
                                    setYears({ value: event.target.value })
                                    setCantidadDatos(prevState => prevState)
                                }}
                                indicador={years}
                                label={`Año (desde - ${year})`}
                                disabled={intervalo.value === 'd1' ? false : true}
                            />
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Selector
                                selectores={seleccionIntervalo()}
                                indicadorHandler={intervaloHandler}
                                indicador={intervalo}
                                label="Intervalo"
                            />
                        </CardContent>
                    </Card>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Input
                                cantidadHandler={event => setCantidadDatos(event.target.value)}
                                cantidadDatos={cantidadDatos}
                                maxDatos={valoresIndicador.length}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="chart">
                    <Chart
                        year={years}
                        indicador={indicador}
                        valoresIndicador={valoresIndicador}
                        cantidadDatos={cantidadDatos}
                        intervalo={intervalo}
                    />
                </div>
            </div>
        )
    }
}

export default MyApi
