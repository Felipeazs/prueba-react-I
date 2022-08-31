export const formato = (inputDate) => {
	let date, month, year;

	date = inputDate.getDate();
	month = inputDate.getMonth() + 1;
	year = inputDate.getFullYear();

	date = date.toString().padStart(2, '0');

	month = month.toString().padStart(2, '0');

	return `${date}-${month}-${year}`;
};

export const seleccionYears = (year, n) => {
	let min = year - n;
	const listaYears = [];
	for (let i = year; i >= min; i--) {
		listaYears.push(+i);
	}

	return listaYears;
};

export const etiqueta = (indicador) => {
	let etiqueta;
	switch (indicador) {
		case 'tpm':
		case 'imacec':
		case 'tasa_desempleo':
		case 'ipc':
			etiqueta = '%';
			break;
		case 'libra_cobre':
			etiqueta = '$ USD/libra';
			break;
		case 'bitcoin':
			etiqueta = '$ USD';
			break;
		default:
			etiqueta = '$ CLP';
	}

	return etiqueta;
};
