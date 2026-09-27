import { createTheme } from '@mui/material/styles';

// App-wide colors, taken from the existing FlickQueue styles
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#6BAA75' },
        background: { default: '#080101', paper: '#262626' },
        text: { primary: '#ffffff', secondary: '#8C8C8C' },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    minHeight: '100vh',
                    background: 'linear-gradient(to bottom, #8F0007 0%, #080101 40%) fixed',
                },
            },
        },
    },
});

export default theme;