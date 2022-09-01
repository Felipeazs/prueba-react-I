import React from 'react'

//MUI
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import chartTrendline from 'chartjs-plugin-trendline'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)
ChartJS.register(chartTrendline)
ChartJS.defaults.font.size = 16

const Chart = ({ indicador, valoresIndicador, cantidadDatos, year, intervalo }) => {
    valoresIndicador = valoresIndicador.slice(`-${cantidadDatos}`)

    const series = valoresIndicador.map(valor => valor.serie)

    const labels = valoresIndicador.map(valor => valor.fecha.substring(5, 10))

    let trendline = {
        colorMin: 'rgb(71, 40, 54)',
        colorMax: 'green',
        lineStyle: 'dotted',
        width: 2,
        projection: false,
    }

    if (cantidadDatos <= 1) {
        trendline = null
    }

    const data = {
        labels,
        datasets: [
            {
                label: indicador.nombre,
                data: series,
                borderColor: 'rgb(244, 211, 94)',
                backgroundColor: 'rgba(238, 150, 75, 0.5)',
                trendlineLinear: trendline,
            },
        ],
    }

    const options = {
        responsive: true,
        scales: {
            y: {
                title: {
                    display: true,
                    text: `Valor ($ USD)`,
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
                text: `Indicadores del ${indicador.nombre} `,
                font: {
                    size: '20px',
                },
            },
        },
    }

    return (
        <Card sx={{ width: 1000 }}>
            <CardContent>
                <Line
                    options={options}
                    data={data}
                />
            </CardContent>
        </Card>
    )
}

export default Chart
