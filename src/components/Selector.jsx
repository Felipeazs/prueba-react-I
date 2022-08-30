import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Selector({ indicador, selectores, indicadorHandler }) {
	const listaIndicadores = selectores.map((selector, i) => {
		return (
			<MenuItem
				key={i}
				value={selector}
			>
				{selector}
			</MenuItem>
		);
	});

	return (
		<Box sx={{ minWidth: 220 }}>
			<FormControl fullWidth>
				<InputLabel id='demo-simple-select-label'>Indicador</InputLabel>
				<Select
					labelId='demo-simple-select-label'
					id='demo-simple-select'
					value={indicador}
					label='Indicador'
					onChange={indicadorHandler}
				>
					{listaIndicadores}
				</Select>
			</FormControl>
		</Box>
	);
}
