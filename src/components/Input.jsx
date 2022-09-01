import React, {
    Fragment,
    useState,
    useEffect,
} from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

export default function Input({
    cantidadHandler,
    cantidadDatos,
    maxDatos,
    type,
}) {
    const [error, setError] = useState(false)

    useEffect(() => {
        if (cantidadDatos > maxDatos) {
            setError(true)
        } else {
            setError(false)
        }
    }, [cantidadDatos, maxDatos])

    return (
        <Fragment>
            <Box
                sx={{
                    '& > :not(style)': {
                        width: '25ch',
                    },
                }}
                noValidate
                autoComplete="off">
                <TextField
                    error={error}
                    id="outlined-basic"
                    label="cantidad de datos"
                    variant="outlined"
                    helperText={`max. ${maxDatos}`}
                    value={cantidadDatos}
                    onChange={cantidadHandler}
                />
            </Box>
        </Fragment>
    )
}
