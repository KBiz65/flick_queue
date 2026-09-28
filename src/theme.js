import { createTheme } from '@mui/material/styles';

// "Screening room" palette: a quiet, dark theater so the posters carry the color
export const colors = {
    theater: '#16121C', // page background
    seat: '#211B29', // cards, dialogs, navbar
    aisle: '#2E2738', // borders, inputs, hover
    screen: '#F3EFE9', // main text
    usher: '#A59FB0', // secondary text
    marquee: '#F2B544', // the one accent: primary actions, watched, focus
    velvet: '#7A1E2C', // the old FlickQueue red, now only a glow behind title backdrops
};

const displayFont = '"Big Shoulders Display Variable", "Arial Narrow", sans-serif';
const bodyFont = '"Figtree Variable", "Helvetica Neue", Arial, sans-serif';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: colors.marquee, contrastText: colors.theater },
        background: { default: colors.theater, paper: colors.seat },
        text: { primary: colors.screen, secondary: colors.usher },
        divider: colors.aisle,
    },
    shape: { borderRadius: 10 },
    typography: {
        fontFamily: bodyFont,
        h1: { fontFamily: displayFont, fontWeight: 800, fontSize: 'clamp(2.75rem, 6vw, 5rem)', lineHeight: 0.95, letterSpacing: '0.01em' },
        h2: { fontFamily: displayFont, fontWeight: 800, fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', lineHeight: 1, letterSpacing: '0.01em' },
        h3: { fontFamily: displayFont, fontWeight: 800, fontSize: '2.5rem', lineHeight: 1.05, letterSpacing: '0.01em' },
        h4: { fontFamily: displayFont, fontWeight: 800, fontSize: '2rem', lineHeight: 1.1, letterSpacing: '0.01em' },
        h5: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.3 },
        h6: { fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.35 },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
        body1: { lineHeight: 1.6 },
        button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: { backgroundColor: colors.theater, minHeight: '100vh' },
                '::selection': { backgroundColor: colors.marquee, color: colors.theater },
                '@media (prefers-reduced-motion: reduce)': {
                    '*, *::before, *::after': { animationDuration: '0.01ms !important', transitionDuration: '0.01ms !important' },
                },
            },
        },
        MuiPaper: {
            styleOverrides: { root: { backgroundImage: 'none' } },
        },
        MuiCard: {
            styleOverrides: { root: { border: `1px solid ${colors.aisle}` } },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(22, 18, 28, 0.78)',
                    backdropFilter: 'blur(14px)',
                    borderBottom: `1px solid ${colors.aisle}`,
                    boxShadow: 'none',
                },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 999, paddingLeft: 20, paddingRight: 20 },
                sizeLarge: { paddingTop: 10, paddingBottom: 10, fontSize: '1rem' },
                outlined: { borderColor: colors.aisle, color: colors.screen, '&:hover': { borderColor: colors.usher } },
            },
        },
        // Labels sit above the field instead of floating inside the border
        MuiTextField: {
            defaultProps: { fullWidth: true, slotProps: { inputLabel: { shrink: true } } },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    position: 'static',
                    transform: 'none',
                    marginBottom: 6,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: colors.usher,
                    '&.Mui-focused': { color: colors.screen },
                    '&.Mui-error': { color: colors.usher },
                },
                asterisk: { color: colors.marquee },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.theater,
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: colors.aisle, top: 0 },
                    '& .MuiOutlinedInput-notchedOutline legend': { display: 'none' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.usher },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.marquee, borderWidth: 1 },
                },
                input: {
                    padding: '12px 14px',
                    // Stop Chrome's autofill from painting the field light blue
                    '&:-webkit-autofill': {
                        WebkitBoxShadow: `0 0 0 100px ${colors.theater} inset`,
                        WebkitTextFillColor: colors.screen,
                        caretColor: colors.screen,
                        borderRadius: 'inherit',
                    },
                },
                inputSizeSmall: { padding: '9px 14px' },
            },
        },
        MuiFormHelperText: {
            styleOverrides: { root: { marginLeft: 2, marginRight: 0 } },
        },
        MuiDialog: {
            styleOverrides: { paper: { border: `1px solid ${colors.aisle}`, borderRadius: 14 } },
        },
        MuiDialogTitle: {
            styleOverrides: { root: { fontWeight: 700, fontSize: '1.2rem' } },
        },
        MuiMenu: {
            styleOverrides: { paper: { border: `1px solid ${colors.aisle}`, marginTop: 6 } },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600 },
                outlined: { borderColor: colors.aisle, color: colors.screen },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    color: colors.usher,
                    borderColor: colors.aisle,
                    '&.Mui-selected': { color: colors.theater, backgroundColor: colors.marquee },
                    '&.Mui-selected:hover': { backgroundColor: colors.marquee },
                },
            },
        },
        MuiLinearProgress: {
            styleOverrides: { root: { backgroundColor: colors.aisle, borderRadius: 999, height: 4 } },
        },
        MuiTooltip: {
            styleOverrides: { tooltip: { backgroundColor: colors.aisle, fontSize: '0.8rem' } },
        },
    },
});

export default theme;