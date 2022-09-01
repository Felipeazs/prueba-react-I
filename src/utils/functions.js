export const formato = inputDate => {
    let date, month, year

    date = inputDate.getDate()
    month = inputDate.getMonth() + 1
    year = inputDate.getFullYear()

    date = date.toString().padStart(2, '0')

    month = month.toString().padStart(2, '0')

    return `${date}-${month}-${year}`
}

export const seleccionYears = (year, n) => {
    let min = year - n
    const listaYears = []
    for (let i = year; i >= min; i--) {
        listaYears.push({ nombre: +i, value: +i })
    }

    return listaYears
}

export const seleccionIntervalo = () => {
    return [
        {
            nombre: '1 Minuto',
            value: 'm1',
        },
        {
            nombre: '5 Minutos',
            value: 'm5',
        },
        {
            nombre: '10 Minutos',
            value: 'm10',
        },
        {
            nombre: '15 Minutos',
            value: 'm15',
        },
        {
            nombre: '30 Minutos',
            value: 'm30',
        },
        { nombre: '1 Hora', value: 'h1' },
        { nombre: '2 Horas', value: 'h2' },
        { nombre: '6 Horas', value: 'h6' },
        { nombre: '12 Horas', value: 'h12' },
        { nombre: 'Dias', value: 'd1' },
    ]
}

export const etiqueta = indicador => {
    let etiqueta
    switch (indicador) {
        case 'tpm':
        case 'imacec':
        case 'tasa_desempleo':
        case 'ipc':
            etiqueta = '%'
            break
        case 'libra_cobre':
            etiqueta = '$ USD/libra'
            break
        case 'bitcoin':
            etiqueta = '$ USD'
            break
        default:
            etiqueta = '$ CLP'
    }

    return etiqueta
}
