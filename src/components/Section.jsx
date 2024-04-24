import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const Section = ({ title, children }) => (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" component="h2">
            {title}
        </Typography>
        <Box>
            {children}
        </Box>
    </Paper>
);

export default Section;
