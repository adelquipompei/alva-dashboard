import React from 'react'
import { Box, Typography } from '@mui/material'
function BoxBienvenida({icon, text, titulo}) {
    return (
        <>
            <Box
                sx={{
                    mb: 3,
                    p: 3,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #fff8e1 0%, #ffe082 100%)',
                    boxShadow: '0px 4px 15px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {icon}
                    <Typography variant="h6" fontWeight="bold">
                       {titulo}
                    </Typography>
                </Box>
                <Typography variant="body2" color="#5f5f5f">
                    {text}
                </Typography>
            </Box>
        </>
    )
}

export default BoxBienvenida