import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

export default function Selector({ indicador, selectores, indicadorHandler, label, disabled }) {
    const listaIndicadores = selectores.map((selector, i) => {
        return (
            <MenuItem
                key={selector.value}
                value={selector.value}>
                {selector.name}
            </MenuItem>
        )
    })

    return (
        <Box sx={{ minWidth: 220 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={indicador}
                    label={label}
                    onChange={indicadorHandler}
                    disabled={disabled}>
                    {listaIndicadores}
                </Select>
            </FormControl>
        </Box>
    )
}
