export const seleccionYears = (year, n) => {
    let min = year - n
    const listaYears = []
    for (let i = year; i >= min; i--) {
        listaYears.push({ name: +i, value: +i })
    }

    return listaYears
}

export const seleccionIntervalo = () => {
    return [
        {
            name: '1 Minuto',
            value: 'm1',
        },
        {
            name: '5 Minutos',
            value: 'm5',
        },
        {
            name: '15 Minutos',
            value: 'm15',
        },
        {
            name: '30 Minutos',
            value: 'm30',
        },
        { name: '1 Hora', value: 'h1' },
        { name: '2 Horas', value: 'h2' },
        { name: '6 Horas', value: 'h6' },
        { name: '12 Horas', value: 'h12' },
        { name: 'Dias', value: 'd1' },
    ]
}
