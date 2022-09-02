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
    SubTitle,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

import chartTrendline from 'chartjs-plugin-trendline'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    SubTitle,
    Tooltip,
    Legend,
    Filler
)
ChartJS.register(chartTrendline)
ChartJS.defaults.font.family = 'Source Sans Pro'

const Chart = ({ indicador, valoresIndicador, cantidadDatos, intervalo }) => {
    valoresIndicador = valoresIndicador.slice(`-${cantidadDatos}`)

    const series = valoresIndicador.map(valor => valor.serie)

    const labels = valoresIndicador.map(valor => valor.fecha.substring(0, 10))

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
                type: 'line',
                label: indicador,
                data: series,
                borderColor: 'rgb(44, 44, 52)',
                backgroundColor: 'rgba(8, 146, 165, 0.8)',
                trendlineLinear: trendline,
                fill: true,
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
                grid: {
                    display: false,
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
                ticks: {
                    maxTicksLimit: 15,
                },
                grid: {
                    display: false,
                },
            },
        },
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: `${indicador} ${intervalo === 'd1' ? '(anual)' : '(30 días)'}`,
                font: {
                    size: '18px',
                },
                padding: { top: 20, bottom: 50 },
            },
            subtitle: {
                display: false,
            },
        },
        interaction: {
            intersect: false,
            axis: 'x',
            mode: 'nearest',
        },
    }

    return (
        <Card sx={{ width: 1000 }}>
            <CardContent>
                <Line
                    className="lineChart"
                    options={options}
                    data={data}
                />
            </CardContent>
        </Card>
    )
}

export default Chart
